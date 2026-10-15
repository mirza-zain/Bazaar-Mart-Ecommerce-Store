'use client';

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Package,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import { Product, Order } from "@/app/db/schema";
import {
  addProductAction,
  deleteProductAction,
  updateOrderStatusAction,
  verifyPaymentAction,
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
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [subCategory, setSubCategory] = useState("T-Shirt");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/img1.jpg");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

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
    if (selectedFile) {
      formData.append("imageFile", selectedFile);
    }

    startTransition(async () => {
      const res = await addProductAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setSelectedFile(null);
        setImagePreview(null);
        setImage("/images/img1.jpg");
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

  const handleVerifyPayment = (orderId: number, status: "Verified" | "Rejected") => {
    startTransition(async () => {
      const res = await verifyPaymentAction(orderId, status);
      if (res.success) {
        setStatusMessage(`Payment marked as ${status}.`);
        if (selectedProofOrder && selectedProofOrder.id === orderId) {
          setSelectedProofOrder(null);
        }
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert(res.error || "Failed to update payment status.");
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
                        onClick={() => setIsModalOpen(true)}
                        className="mt-3 text-sm text-black underline font-medium cursor-pointer"
                      >
                        Add your first product
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
                  <th className="py-3 px-4">Payment & Total</th>
                  <th className="py-3 px-4">Payment Proof & Approval</th>
                  <th className="py-3 px-4">Fulfillment</th>
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
                  filteredOrders.map((o) => {
                    const isBankTransfer = o.paymentMethod === "bank_transfer";
                    const isVerified = o.paymentStatus === "Verified";
                    const isRejected = o.paymentStatus === "Rejected";

                    return (
                      <tr key={o.id} className="hover:bg-neutral-50/60 transition">
                        <td className="py-3 px-4 font-mono font-medium text-neutral-700">
                          #ORD-{o.id.toString().padStart(4, "0")}
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-neutral-900">{o.customerName}</p>
                          <p className="text-xs text-neutral-400">{o.customerEmail}</p>
                          {o.phone && <p className="text-xs text-neutral-500 font-mono mt-0.5">{o.phone}</p>}
                          {o.city && (
                            <p className="text-xs text-neutral-400 truncate max-w-[220px]" title={o.address ? `${o.address}, ${o.city}` : o.city}>
                              {o.city}{o.address ? ` • ${o.address}` : ""}
                            </p>
                          )}
                          {o.items && o.items.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1 max-w-[280px]">
                              {o.items.map((it: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-block text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded border border-neutral-200"
                                  title={`${it.name} (Qty: ${it.quantity}${it.variant ? `, ${it.variant}` : ""})`}
                                >
                                  {it.quantity}x {it.name.length > 18 ? `${it.name.slice(0, 18)}...` : it.name}
                                  {it.variant && ` (${it.variant})`}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-neutral-900">
                            PKR {Number(o.totalAmount).toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isBankTransfer
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {isBankTransfer ? "Bank Transfer" : "COD"}
                            </span>
                            {o.discountCode && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                {o.discountCode} (-PKR {Number(o.discountAmount || 0).toLocaleString()})
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isBankTransfer ? (
                            <div className="space-y-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  isVerified
                                    ? "bg-emerald-100 text-emerald-800"
                                    : isRejected
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {isVerified ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Verified</span>
                                  </>
                                ) : isRejected ? (
                                  <>
                                    <Ban className="w-3 h-3 text-rose-600" />
                                    <span>Rejected</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Pending Verification</span>
                                  </>
                                )}
                              </span>

                              <div className="flex items-center gap-2 pt-1">
                                {o.paymentProof && (
                                  <button
                                    onClick={() => setSelectedProofOrder(o)}
                                    className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-black font-medium underline cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Receipt</span>
                                  </button>
                                )}

                                {!isVerified && (
                                  <button
                                    onClick={() => handleVerifyPayment(o.id, "Verified")}
                                    disabled={isPending}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition cursor-pointer"
                                    title="Approve Bank Payment"
                                  >
                                    Approve
                                  </button>
                                )}

                                {!isRejected && !isVerified && (
                                  <button
                                    onClick={() => handleVerifyPayment(o.id, "Rejected")}
                                    disabled={isPending}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-lg transition cursor-pointer"
                                    title="Reject Payment"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-500">Collect on delivery</span>
                          )}
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
                    );
                  })
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
                  Product Image (Cloudinary)
                </label>

                {imagePreview || (image && !image.startsWith("data:")) ? (
                  <div className="relative mb-2.5 flex items-center gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-neutral-200">
                      <Image
                        src={imagePreview || image}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 truncate">
                        {selectedFile ? selectedFile.name : image}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium">Ready to upload to Cloudinary</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                        setImage("/images/img1.jpg");
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition"
                      title="Reset image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer transition border border-dashed border-neutral-300">
                    <Upload className="w-4 h-4 text-neutral-500" />
                    <span>Upload Image from Device</span>
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
                    value={image.startsWith("data:") ? "" : image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    placeholder="Or enter image URL / Cloudinary URL"
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                </div>
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

      {/* Payment Screenshot Proof Inspection Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Payment Transfer Screenshot
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Order #ORD-{selectedProofOrder.id.toString().padStart(4, "0")}
                </p>
              </div>

              <button
                onClick={() => setSelectedProofOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Order details summary */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-2xl text-xs">
              <div>
                <span className="text-neutral-400 font-medium block">Customer</span>
                <span className="font-semibold text-neutral-900">{selectedProofOrder.customerName}</span>
                <span className="text-neutral-500 block truncate">{selectedProofOrder.customerEmail}</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 font-medium block">Transferred Amount</span>
                <span className="font-bold text-base text-neutral-900">
                  PKR {Number(selectedProofOrder.totalAmount).toLocaleString()}
                </span>
                <span className="text-neutral-500 block">{selectedProofOrder.paymentStatus}</span>
              </div>
            </div>

            {/* Screenshot Display */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">
                Submitted Screenshot Receipt
              </span>
              <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200">
                {selectedProofOrder.paymentProof ? (
                  <Image
                    src={selectedProofOrder.paymentProof}
                    alt="Payment receipt proof"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                    No screenshot provided
                  </div>
                )}
              </div>
            </div>

            {/* Approval / Rejection Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => handleVerifyPayment(selectedProofOrder.id, "Rejected")}
                disabled={isPending}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Reject Payment
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProofOrder(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(selectedProofOrder.id, "Verified")}
                  disabled={isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isPending ? "Updating..." : "Approve & Mark Verified"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
