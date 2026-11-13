import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import { isValidPricingUnit } from "@/lib/pricingUnits";
import { DEFAULT_PRODUCTS } from "@/lib/defaultProducts";

interface Pricing {
  quantity: number;
  unit: string;
  price: number;
  sizeLabel?: string;
}

interface ProductUpdateData {
  name?: string;
  description?: string;
  type?: string;
  gstPercentage?: number;
  pricing?: Pricing[];
  image?: string;
}

interface ProductRequestBody {
  name?: string;
  description?: string;
  type?: string;
  gstPercentage?: number;
  pricing?: Pricing[];
  image?: string;
  imageBase64?: string;
}

// GET: Fetch product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Handle fallback / seeded product IDs
  if (id.startsWith("seed-product-")) {
    const idx = parseInt(id.replace("seed-product-", ""), 10) - 1;
    if (idx >= 0 && idx < DEFAULT_PRODUCTS.length) {
      const fallbackItem = {
        _id: id,
        ...DEFAULT_PRODUCTS[idx],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json(fallbackItem, { status: 200 });
    }
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      // If DB is offline, check fallback list
      const idx = DEFAULT_PRODUCTS.findIndex((_, i) => `seed-product-${i + 1}` === id);
      if (idx !== -1) {
        return NextResponse.json({
          _id: id,
          ...DEFAULT_PRODUCTS[idx],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { status: 200 });
      }
      return NextResponse.json({ message: "Database connection unavailable" }, { status: 503 });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT: Update product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ message: "Database connection unavailable" }, { status: 503 });
    }
    const body: ProductRequestBody = await req.json();
    const { name, description, type, image, imageBase64, pricing, gstPercentage } = body;

    const update: ProductUpdateData = {};

    // Only add fields that are provided
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (type !== undefined) update.type = type;
    if (gstPercentage !== undefined && typeof gstPercentage === 'number' && gstPercentage >= 0 && gstPercentage <= 100) {
      update.gstPercentage = gstPercentage;
    }

    // Handle pricing validation and update
    if (pricing !== undefined) {
      if (!Array.isArray(pricing) || pricing.length === 0) {
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

      update.pricing = pricing.map((p: Pricing): Pricing => {
        const row: Pricing = {
          quantity: Number(p.quantity),
          unit: p.unit,
          price: Number(p.price),
        };
        const sl = typeof p.sizeLabel === 'string' ? p.sizeLabel.trim() : '';
        if (sl) row.sizeLabel = sl;
        return row;
      });
    }

    // Handle image upload
    if (imageBase64 && imageBase64.startsWith("data:image")) {
      try {
        const uploadRes = await cloudinary.uploader.upload(imageBase64, {
          folder: "products",
        });
        update.image = uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
      }
    } else if (image && !update.image) {
      update.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, update, { 
      new: true,
      runValidators: true 
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}