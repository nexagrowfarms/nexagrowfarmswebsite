"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddProducts from "@/components/AddProduct";
import AdminLogin from "@/components/AdminLoginForm";
import { Package, Edit, Trash2, Plus, IndianRupee, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { PricingUnit } from "@/lib/pricingUnits";
import { isValidPricingUnit } from "@/lib/pricingUnits";
import { formatPricingDisplayLabel } from "@/lib/pricingDisplay";
import { BRAND } from "@/lib/brand";

interface ProductPricing {
  quantity: number;
  unit: PricingUnit;
  price: number;
  sizeLabel?: string;
}

interface ProductPayload {
  name: string;
  description: string;
  type: string;
  pricing: ProductPricing[];
  gstPercentage?: number;
  imageBase64?: string;
  image?: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  imageBase64?: string;
  type?: string;
  gstPercentage?: number;
  pricing: ProductPricing[];
}

export default function AdminPanel() {
  const router = useRouter();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
  };

  const handleLogin = async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);


  const [product, setProduct] = useState<Product>({ 
    name: '', 
    description: '', 
    type: 'latest',
    gstPercentage: 18,
    pricing: [{ quantity: 100, unit: 'gm', price: 0 }]
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const totalProducts = products.length;
  const allPrices = [
    ...products.flatMap(p => p.pricing?.map(pr => pr.price) || [0])
  ].filter(price => price > 0);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleAddProduct = () => {
    setProduct({ 
      name: '', 
      description: '', 
      type: 'latest',
      gstPercentage: 18,
      pricing: [{ quantity: 100, unit: 'gm', price: 0 }]
    });
    setProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    const rows =
      p.pricing && p.pricing.length > 0
        ? p.pricing.map((row) => ({
            ...row,
            unit: (isValidPricingUnit(String(row.unit)) ? row.unit : 'gm') as PricingUnit,
          }))
        : [{ quantity: 100, unit: 'gm' as PricingUnit, price: 0 }];
    setProduct({
      ...p,
      pricing: rows,
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (_id?: string) => {
    if (!_id || !confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product?id=${_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleSubmitProduct = async () => {
    try {
      const validPricing = product.pricing.filter(p => p.quantity > 0 && p.price > 0);
      
      if (validPricing.length === 0) {
        alert("Please add at least one valid pricing option with quantity and price greater than 0");
        return;
      }

      const method = product._id ? "PUT" : "POST";
      const url = product._id ? `/api/product/${product._id}` : "/api/product";

      const payload: ProductPayload = {
        name: product.name,
        description: product.description,
        type: product.type || "latest",
        pricing: validPricing
      };

      if (product.gstPercentage !== undefined && product.gstPercentage >= 0 && product.gstPercentage <= 100) {
        payload.gstPercentage = product.gstPercentage;
      }

      if (product.imageBase64?.startsWith("data:image")) {
        payload.imageBase64 = product.imageBase64;
      } else if (product.image) {
        payload.image = product.image;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to save product: ${res.status}`);
      }

      setProductModalOpen(false);
      fetchProducts();
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save product";
      alert(`Failed to save product: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--leaf-800)' }}>
              {BRAND.name} Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage organic moringa products and inventory</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddProduct}
              className="text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: 'var(--leaf-600)' }}
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
            <button 
              onClick={() => router.push('/admin/enquiries')}
              className="px-4 py-2.5 rounded-xl font-medium border transition-colors hover:bg-white text-gray-700"
              style={{ borderColor: 'var(--leaf-200)' }}
            >
              Enquiries
            </button>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="px-4 py-2.5 rounded-xl font-medium border transition-colors hover:bg-white text-gray-700"
              style={{ borderColor: 'var(--leaf-200)' }}
            >
              All Orders
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors border border-red-200"
            >
              <Lock className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'var(--leaf-200)' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--leaf-100)' }}>
                <Package className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'var(--leaf-200)' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--leaf-100)' }}>
                <IndianRupee className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price Range</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts > 0 ? `₹${minPrice} - ₹${maxPrice}` : '₹0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'var(--leaf-200)' }}>
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--leaf-100)' }}>
                <Edit className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tags / Badges</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set([...products.map(p => p.type)].filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        {totalProducts === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: 'var(--leaf-200)' }}>
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--leaf-400)' }} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first Moringa product</p>
            <button
              onClick={handleAddProduct}
              className="text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all inline-flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: 'var(--leaf-600)' }}
            >
              <Plus className="w-5 h-5" />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Moringa Products ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow flex flex-col overflow-hidden"
                  style={{ borderColor: 'var(--leaf-200)' }}
                >
                  <div className="relative overflow-hidden h-48 bg-gray-100">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name || "Product Image"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                    {p.type && (
                      <span 
                        className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
                        style={{
                          backgroundColor: 'var(--leaf-500)',
                          color: '#fff'
                        }}
                      >
                        {p.type}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pricing Options:</p>
                        {p.pricing && p.pricing.length > 0 ? (
                          <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl">
                            {p.pricing.map((pricing, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium">
                                  {formatPricingDisplayLabel(
                                    {
                                      quantity: pricing.quantity,
                                      unit: String(pricing.unit),
                                      price: pricing.price,
                                      sizeLabel: pricing.sizeLabel,
                                    },
                                    p.name
                                  )}
                                </span>
                                <span className="font-bold" style={{ color: 'var(--leaf-700)' }}>
                                  ₹{pricing.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No pricing set</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="flex-1 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-sm font-semibold border border-amber-200"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-sm font-semibold border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <AddProducts
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          onSubmit={handleSubmitProduct}
          product={product}
          setProduct={setProduct}
        />
      </div>
    </div>
  );
}