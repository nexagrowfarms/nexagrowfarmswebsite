import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { Product } from "@/models/Product";
import { isValidPricingUnit } from "@/lib/pricingUnits";
import { DEFAULT_PRODUCTS } from "@/lib/defaultProducts";

interface Pricing {
  quantity: number;
  unit: string;
  price: number;
  sizeLabel?: string;
}

// GET: Fetch all products (auto-seeds defaults if empty or ?seed=true)
export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    const url = new URL(req.url);
    const shouldSeed = url.searchParams.get("seed") === "true";

    if (conn) {
      let products = await Product.find({});
      if (products.length === 0 || shouldSeed) {
        if (shouldSeed && products.length > 0) {
          // Only insert if not already present by name
          for (const item of DEFAULT_PRODUCTS) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
              await Product.create(item);
            }
          }
        } else if (products.length === 0) {
          await Product.insertMany(DEFAULT_PRODUCTS);
        }
        products = await Product.find({});
      }

      if (products && products.length > 0) {
        return NextResponse.json(products, { status: 200 });
      }
    }

    // Fallback: If DB is unreachable or empty and couldn't seed, return default products with deterministic IDs
    const fallbackProducts = DEFAULT_PRODUCTS.map((prod, idx) => ({
      _id: `seed-product-${idx + 1}`,
      ...prod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return NextResponse.json(fallbackProducts, { status: 200 });
  } catch (error) {
    console.error("Get products error, returning fallback:", error);
    const fallbackProducts = DEFAULT_PRODUCTS.map((prod, idx) => ({
      _id: `seed-product-${idx + 1}`,
      ...prod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return NextResponse.json(fallbackProducts, { status: 200 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ message: "Database connection unavailable" }, { status: 503 });
    }
  
    const body = await req.json();
    const { name, description, type = "latest", imageBase64, pricing, gstPercentage } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ message: "Name and description are required" }, { status: 400 });
    }

    // Validate pricing
    if (!pricing || !Array.isArray(pricing) || pricing.length === 0) {
      return NextResponse.json({ message: "At least one pricing option is required" }, { status: 400 });
    }

    // Validate each pricing option
    for (const price of pricing) {
      if (!price.quantity || price.quantity <= 0) {
        return NextResponse.json({ message: "All pricing options must have a valid quantity greater than 0" }, { status: 400 });
      }
      if (!price.price || price.price <= 0) {
        return NextResponse.json({ message: "All pricing options must have a valid price greater than 0" }, { status: 400 });
      }
      if (!isValidPricingUnit(price.unit)) {
        return NextResponse.json({ message: "Invalid pricing unit" }, { status: 400 });
      }
    }

    let imageUrl = "";
    if (imageBase64?.startsWith("data:image")) {
      try {
        const uploaded = await cloudinary.uploader.upload(imageBase64, {
          folder: "products",
        });
        imageUrl = uploaded.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
      }
    }

    // Validate that image is provided
    if (!imageUrl) {
      return NextResponse.json({ message: "Product image is required" }, { status: 400 });
    }

    const productData: Record<string, unknown> = {
      name,
      description,
      type,
      image: imageUrl,
      pricing: pricing.map((p: Pricing) => {
        const row: Record<string, unknown> = {
          quantity: Number(p.quantity),
          unit: p.unit,
          price: Number(p.price),
        };
        const sl = typeof p.sizeLabel === 'string' ? p.sizeLabel.trim() : '';
        if (sl) row.sizeLabel = sl;
        return row;
      })
    };
    if (gstPercentage !== undefined && typeof gstPercentage === 'number' && gstPercentage >= 0 && gstPercentage <= 100) {
      productData.gstPercentage = gstPercentage;
    }
    const product = await Product.create(productData);

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Create product error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ message: errorMessage, error: String(error) }, { status: 500 });
  }
}

// DELETE: Delete product by ID (using query parameter)
export async function DELETE(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ message: "Database connection unavailable" }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing product ID" }, { status: 400 });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (product.image) {
      try {
        const urlParts = product.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `products/${publicIdWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (imageDeleteError) {
        console.error("Failed to delete image from Cloudinary:", imageDeleteError);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}