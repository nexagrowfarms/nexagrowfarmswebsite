"use client";

import { Dispatch, SetStateAction, ChangeEvent } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import type { PricingUnit } from "@/lib/pricingUnits";
import { ADMIN_PRODUCT_UNIT_OPTIONS } from "@/lib/pricingUnits";
import { formatPricingDisplayLabel } from "@/lib/pricingDisplay";

interface Pricing {
  quantity: number;
  unit: PricingUnit;
  price: number;
  sizeLabel?: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  imageBase64?: string;
  type?: string;
  gstPercentage?: number;
  pricing: Pricing[];
}

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: Product;
  setProduct: Dispatch<SetStateAction<Product>>;
}

export default function AddProducts({
  isOpen,
  onClose,
  onSubmit,
  product,
  setProduct,
}: AddProductProps) {
  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addPricing = () => {
    setProduct((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { quantity: 0, unit: 'gm', price: 0 }]
    }));
  };

  const removePricing = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }));
  };

  const updatePricing = (index: number, field: keyof Pricing, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      pricing: prev.pricing.map((pricing, i) => 
        i === index 
          ? { 
              ...pricing, 
              [field]: field === 'unit' ? (value as PricingUnit) : Number(value) || 0 
            }
          : pricing
      )
    }));
  };

  const isFormValid = () => {
    return (
      product.name.trim() !== '' &&
      product.description.trim() !== '' &&
      (product.imageBase64 || product.image) &&
      product.pricing.length > 0 &&
      product.pricing.every(p => p.quantity > 0 && p.price > 0)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold">
          {product?._id ? "Edit Moringa Product" : "Add Moringa Product"}
        </h2>

        {/* Basic Product Info */}
        <div className="space-y-4">
          <input
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            placeholder="Product Name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            placeholder="Product Description"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product tag (shown to users)
            </label>
            <select
              name="type"
              value={product.type ?? "latest"}
              onChange={(e) => setProduct((prev) => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">Newly Launched</option>
              <option value="popular">Best Sellers</option>
              <option value="healthy">Healthy</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose how this product appears: Newly Launched, Best Sellers, or Healthy. It will always appear in &quot;All&quot;. New products often use Newly Launched.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Percentage (%)
            </label>
            <input
              name="gstPercentage"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={product.gstPercentage ?? 18}
              onChange={(e) => setProduct((prev) => ({ ...prev, gstPercentage: e.target.value === '' ? undefined : Number(e.target.value) }))}
              placeholder="e.g. 0, 5, 12, 18"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Applicable GST rate for this product (e.g. 0, 5, 12, 18). Default: 18%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {product.imageBase64 ? (
            <Image
              alt="Preview"
              width={200}
              height={200}
              src={product.imageBase64}
              className="mt-2 max-h-48 object-contain rounded-lg"
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt={product.name || "Product Image"}
              width={200}
              height={200}
              className="mt-2 object-contain rounded-lg"
            />
          ) : null}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quantity & Pricing</h3>
            <button
              onClick={addPricing}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Pricing
            </button>
          </div>

          {product.pricing.length === 0 && (
            <div className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
            No pricing options added. Click &quot;Add Pricing&quot; to get started.
          </div>
          )}

          {product.pricing.map((pricing, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Option {index + 1}</span>
                {product.pricing.length > 1 && (
                  <button
                    onClick={() => removePricing(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Quantity
                  </label>
                  {pricing.unit === 'ml' || pricing.unit === 'mg' || pricing.unit === 'l' ? (
                    <p className="text-xs text-gray-500 mb-1">
                      {pricing.unit === 'ml' && 'Volume in ml (e.g. 60, 120).'}
                      {pricing.unit === 'mg' && 'Amount in mg.'}
                      {pricing.unit === 'l' && 'Volume in litres (e.g. 1, 1.5).'}
                    </p>
                  ) : null}
                  <input
                    type="number"
                    value={pricing.quantity || ""}
                    onChange={(e) => updatePricing(index, 'quantity', e.target.value)}
                    placeholder="Enter quantity"
                    className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Unit
                  </label>
                  <select
                    value={pricing.unit}
                    onChange={(e) => updatePricing(index, 'unit', e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ADMIN_PRODUCT_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={pricing.price || ""}
                    onChange={(e) => updatePricing(index, 'price', e.target.value)}
                    placeholder="Enter price"
                    className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {pricing.quantity > 0 && pricing.price > 0 ? (
                  <span>
                    <strong>Preview:</strong> {formatPricingDisplayLabel(pricing, product.name)} — ₹{pricing.price}
                    {['gm', 'kg', 'ml', 'mg', 'l'].includes(pricing.unit) ? (
                      <span className="ml-2 text-gray-500">
                        (₹{(pricing.price / pricing.quantity).toFixed(2)} per {pricing.unit})
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span className="text-gray-400">Enter quantity and price to see preview</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            {product?._id ? "Update Product" : "Add Product"}
          </button>
        </div>

        {!isFormValid() && (
          <div className="text-sm text-red-600 text-center">
            Please fill in all required fields (name, description, image) and add at least one pricing option with quantity and price greater than 0.
          </div>
        )}
      </div>
    </div>
  );
}