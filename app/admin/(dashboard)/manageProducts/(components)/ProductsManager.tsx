'use client';

import React, { useState, useEffect, useTransition, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  Eye,
  Minus,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Product } from "@/app/db/schema";
import {
  addProductAction,
  updateProductAction,
  updateProductStockAction,
  deleteProductAction,
} from "@/app/lib/actions/admin";

interface ProductsManagerProps {
  initialProducts: Product[];
}

export default function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Dynamic existing categories derived from current products
  const existingCategories = useMemo(() => {
    const defaultSet = new Set<string>(["Clothing", "Jewelry", "Accessories"]);
    productsList.forEach((p) => {
      if (p.category && p.category.trim()) {
        defaultSet.add(p.category.trim());
      }
    });
    return Array.from(defaultSet).sort();
  }, [productsList]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Clothing");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [customNewCategory, setCustomNewCategory] = useState("");
  const [formSubCategory, setFormSubCategory] = useState("T-Shirt");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("/images/img1.jpg");
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formSelectedFile, setFormSelectedFile] = useState<File | null>(null);

  // Keep state updated on server revalidation
  useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(existingCategories[0] || "Clothing");
    setIsCreatingNewCategory(false);
    setCustomNewCategory("");
    setFormSubCategory("T-Shirt");
    setFormPrice("");
    setFormStock("20");
    setFormDescription("");
    setFormImage("/images/img1.jpg");
    setFormImagePreview(null);
    setFormSelectedFile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setIsCreatingNewCategory(false);
    setCustomNewCategory("");
    setFormSubCategory(product.subCategory || "General");
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormDescription(product.description || "");
    setFormImage(product.image || "/images/img1.jpg");
    setFormImagePreview(product.image || "/images/img1.jpg");
    setFormSelectedFile(null);
    setIsAddModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormImagePreview(base64);
        setFormImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      showToast("Please enter product name and price.", "error");
      return;
    }

    const finalCategory = (isCreatingNewCategory ? customNewCategory.trim() : formCategory.trim());
    if (!finalCategory) {
      showToast("Please select or enter a category name.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", formName.trim());
    formData.append("category", finalCategory);
    formData.append("subCategory", formSubCategory.trim() || "General");
    formData.append("price", formPrice);
    formData.append("stock", formStock || "0");
    formData.append("description", formDescription.trim());
    formData.append("image", formImage);
    if (formSelectedFile) {
      formData.append("file", formSelectedFile);
      formData.append("imageFile", formSelectedFile);
    }

    startTransition(async () => {
      if (editingProduct) {
        // Optimistic update
        setProductsList((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: formName.trim(),
                  category: finalCategory,
                  subCategory: formSubCategory.trim() || "General",
                  price: formPrice,
                  stock: formStock || "0",
                  description: formDescription.trim(),
                  image: formImagePreview || formImage,
                }
              : p
          )
        );

        const res = await updateProductAction(editingProduct.id, formData);
        if (res.success) {
          setIsAddModalOpen(false);
          setEditingProduct(null);
          showToast(`Product "${formName}" updated successfully!`);
          router.refresh();
        } else {
          showToast(res.error || "Failed to update product", "error");
          setProductsList(initialProducts);
        }
      } else {
        const res = await addProductAction(formData);
        if (res.success) {
          setIsAddModalOpen(false);
          showToast(`Product "${formName}" created successfully!`);
          router.refresh();
        } else {
          showToast(res.error || "Failed to add product", "error");
        }
      }
    });
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    // Optimistic delete
    setProductsList((prev) => prev.filter((p) => p.id !== id));

    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        showToast(`Product "${name}" deleted.`);
        router.refresh();
      } else {
        showToast(res.error || "Failed to delete product.", "error");
        setProductsList(initialProducts);
      }
    });
  };

  const handleAdjustStock = (product: Product, delta: number) => {
    const current = Number(product.stock) || 0;
    const newStock = Math.max(0, current + delta);

    // Optimistic update
    setProductsList((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock.toString() } : p))
    );

    startTransition(async () => {
      const res = await updateProductStockAction(product.id, newStock);
      if (res.success) {
        showToast(`Stock for ${product.name} updated to ${newStock}.`);
        router.refresh();
      } else {
        showToast("Failed to update stock", "error");
        setProductsList(initialProducts);
      }
    });
  };

  // Metrics
  const totalCount = productsList.length;
  const inStockCount = productsList.filter((p) => Number(p.stock) > 0).length;
  const lowStockCount = productsList.filter((p) => Number(p.stock) > 0 && Number(p.stock) < 10).length;
  const outOfStockCount = productsList.filter((p) => Number(p.stock) <= 0).length;

  // Filtering
  const filteredProducts = productsList.filter((p) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(query));

    const matchesCategory =
      categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();

    const stockNum = Number(p.stock) || 0;
    let matchesStock = true;
    if (stockFilter === "in_stock") matchesStock = stockNum > 0;
    if (stockFilter === "low_stock") matchesStock = stockNum > 0 && stockNum < 10;
    if (stockFilter === "out_of_stock") matchesStock = stockNum <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl text-sm flex items-center justify-between border shadow-sm transition animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-neutral-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Catalog Products ({totalCount})
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create items, adjust stock counts, and edit prices across your entire store.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-neutral-400 tracking-wider">Total Products</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-neutral-500">Active catalog</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-emerald-600 tracking-wider">In Stock</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{inStockCount}</p>
          <span className="text-[11px] text-neutral-500">Available to buy</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-amber-600 tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{lowStockCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">&lt; 10 items remaining</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-rose-600 tracking-wider">Out of Stock</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{outOfStockCount}</p>
          <span className="text-[11px] text-neutral-500">Needs restock</span>
        </div>
      </div>

      {/* Filters and Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, category, or subcategory..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-hidden focus:border-black flex-1 sm:flex-initial cursor-pointer"
            >
              <option value="all">All Categories</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-hidden focus:border-black flex-1 sm:flex-initial"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt;0)</option>
              <option value="low_stock">Low Stock (&lt;10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>

            {(searchTerm || categoryFilter !== "all" || stockFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStockFilter("all");
                }}
                className="px-3 py-2 text-xs text-neutral-500 hover:text-black font-semibold whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Stock Level & Quick Adjust</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-neutral-500">
                    <Package className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                    <p className="font-medium text-neutral-700">No products match your criteria.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-2 text-xs font-semibold text-black underline cursor-pointer"
                    >
                      + Create a new product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stockNum = Number(p.stock) || 0;
                  const isOutOfStock = stockNum <= 0;
                  const isLowStock = stockNum > 0 && stockNum < 10;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                            <Image
                              src={p.image || "/images/img1.jpg"}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {p.subCategory || "General"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        PKR {Number(p.price).toLocaleString()}
                      </td>

                      {/* Stock Level with Quick Adjusters */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-full text-xs font-semibold ${
                              isOutOfStock
                                ? "bg-rose-100 text-rose-800"
                                : isLowStock
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOutOfStock
                                  ? "bg-rose-600"
                                  : isLowStock
                                  ? "bg-amber-600"
                                  : "bg-emerald-600"
                              }`}
                            />
                            {stockNum} units
                          </span>

                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                            <button
                              onClick={() => handleAdjustStock(p, -1)}
                              disabled={isPending || stockNum <= 0}
                              className="p-1 hover:bg-neutral-200 text-neutral-600 disabled:opacity-30 transition cursor-pointer"
                              title="Decrease stock by 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, 5)}
                              disabled={isPending}
                              className="px-1.5 py-0.5 hover:bg-neutral-200 text-[10px] font-bold text-neutral-700 transition cursor-pointer border-l border-r border-neutral-200"
                              title="Restock +5"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p, 1)}
                              disabled={isPending}
                              className="p-1 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-xl transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            disabled={isPending}
                            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {editingProduct
                    ? `Editing ${editingProduct.name} (#${editingProduct.id})`
                    : "Fill in the details to publish a new piece to your store catalog."}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Oversized Heavyweight Acid Wash Tee"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase text-neutral-700">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isCreatingNewCategory;
                        setIsCreatingNewCategory(nextState);
                        if (nextState) {
                          setCustomNewCategory("");
                        } else {
                          setFormCategory(existingCategories[0] || "Clothing");
                        }
                      }}
                      className="text-[11px] font-semibold text-neutral-800 hover:text-black hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {isCreatingNewCategory ? (
                        <span>Choose existing</span>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>+ New Category</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isCreatingNewCategory ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        value={customNewCategory}
                        onChange={(e) => {
                          setCustomNewCategory(e.target.value);
                          setFormCategory(e.target.value);
                        }}
                        placeholder="Type new category (e.g. Footwear, Hoodies)..."
                        className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                        autoFocus
                      />
                      <p className="text-[10px] text-neutral-400">
                        Will be created and available storewide
                      </p>
                    </div>
                  ) : (
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        if (e.target.value === "__create_new__") {
                          setIsCreatingNewCategory(true);
                          setCustomNewCategory("");
                          setFormCategory("");
                        } else {
                          setFormCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black cursor-pointer"
                    >
                      {existingCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__create_new__">+ Create New Category...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    placeholder="e.g. Graphic Tees, Chains"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="3499"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black font-semibold"
                  />
                </div>
              </div>

              {/* Cloudinary Image Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                  Product Image (Cloudinary Upload)
                </label>

                {formImagePreview ? (
                  <div className="relative mb-3 flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-neutral-200">
                      <Image
                        src={formImagePreview}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-neutral-900 truncate">
                        {formSelectedFile ? formSelectedFile.name : "Current Product Image"}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        {formSelectedFile ? "Ready to upload to Cloudinary" : "Stored image"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSelectedFile(null);
                        setFormImagePreview(null);
                        setFormImage("/images/img1.jpg");
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-2xl cursor-pointer transition border border-dashed border-neutral-300">
                    <Upload className="w-4 h-4 text-neutral-600" />
                    <span>Choose Image from Device (Cloudinary)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={formImage.startsWith("data:") ? "" : formImage}
                    onChange={(e) => {
                      setFormImage(e.target.value);
                      setFormImagePreview(e.target.value);
                      setFormSelectedFile(null);
                    }}
                    placeholder="Or enter direct image URL / Cloudinary URL"
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail fabric composition, silhouette, care instructions, and sizing notes..."
                  className="w-full px-3.5 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 text-xs font-semibold bg-black hover:bg-neutral-800 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isPending ? "Saving..." : editingProduct ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
