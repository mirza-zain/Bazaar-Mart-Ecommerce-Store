'use client';

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Plus,
  ReceiptText,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Product, Order } from "@/app/db/schema";
import {
  addProductAction,
  deleteProductAction,
  seedDemoDataAction,
  updateOrderStatusAction,
  DashboardStats,
} from "@/app/lib/actions/admin";

interface AdminClientViewProps {
  stats: DashboardStats;
  products: Product[];
  orders: Order[];
}

export default function AdminClientView({
  stats,
  products,
  orders,
}: AdminClientViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [subCategory, setSubCategory] = useState("T-Shirt");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/img1.jpg");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    return (
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("image", image);

    startTransition(async () => {
      const res = await addProductAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setStatusMessage("Product added successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert(res.error || "Failed to add product");
      }
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    startTransition(async () => {
      await deleteProductAction(id);
      setStatusMessage("Product deleted.");
      setTimeout(() => setStatusMessage(null), 3000);
    });
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
      setStatusMessage("Order status updated.");
      setTimeout(() => setStatusMessage(null), 3000);
    });
  };

  const handleSeedData = () => {
    startTransition(async () => {
      const res = await seedDemoDataAction();
      if (res.success) {
        setStatusMessage("Demo store data loaded successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Store Overview
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time analytics and inventory powered by Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length === 0 && (
            <button
              onClick={handleSeedData}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-medium rounded-xl transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Load Demo Data</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">
              PKR {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Active Products
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">
              {stats.totalProducts}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Low Stock Alert
            </p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">
              {stats.lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                activeTab === "products"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                activeTab === "orders"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Recent Orders ({orders.length})
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black transition"
              />
            </div>

            {activeTab === "products" && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black text-neutral-700"
              >
                <option value="all">All Categories</option>
                <option value="Clothing">Clothing</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Accessories">Accessories</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-y border-neutral-100 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                      <Package className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                      <p>No products found in database.</p>
                      <button
                        onClick={handleSeedData}
                        className="mt-3 text-sm text-black underline font-medium cursor-pointer"
                      >
                        Load demo catalog
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = Number(p.stock) < 10;
                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/60 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                              <Image
                                src={p.image || "/images/img1.jpg"}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900">{p.name}</p>
                              <p className="text-xs text-neutral-400">{p.subCategory}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-semibold text-neutral-900">
                          PKR {Number(p.price).toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isLowStock
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLowStock ? "bg-amber-600" : "bg-emerald-600"
                              }`}
                            />
                            {p.stock} in stock
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            disabled={isPending}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Orders Table */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-y border-neutral-100 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                      <ReceiptText className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                      <p>No orders recorded yet.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50/60 transition">
                      <td className="py-3 px-4 font-mono font-medium text-neutral-700">
                        #ORD-{o.id.toString().padStart(4, "0")}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-900">{o.customerName}</p>
                        <p className="text-xs text-neutral-400">{o.customerEmail}</p>
                      </td>

                      <td className="py-3 px-4 font-semibold text-neutral-900">
                        PKR {Number(o.totalAmount).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {o.items?.length || 1} item(s)
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`text-xs font-semibold py-1 px-2.5 rounded-lg border transition ${
                            o.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : o.status === "Processing"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">Add New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oversized Heavyweight Tee"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="e.g. Hoodies, Chains"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                  Product Image
                </label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                >
                  <option value="/images/img1.jpg">Image 1 (/images/img1.jpg)</option>
                  <option value="/images/img2.jpg">Image 2 (/images/img2.jpg)</option>
                  <option value="/images/img3.jpg">Image 3 (/images/img3.jpg)</option>
                  <option value="/images/img4.jpg">Image 4 (/images/img4.jpg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product details, fabric, and sizing..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-sm font-medium bg-black hover:bg-neutral-800 text-white rounded-xl shadow-xs transition"
                >
                  {isPending ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
