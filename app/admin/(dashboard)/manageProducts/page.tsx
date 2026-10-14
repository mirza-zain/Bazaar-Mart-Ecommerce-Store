import React from "react";
import { getDashboardData } from "@/app/lib/actions/admin";
import AdminClientView from "../(components)/AdminClientView";

export default async function ManageProductsPage() {
  const data = await getDashboardData();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Manage Products
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Catalog inventory, stock levels, and product creation.
        </p>
      </div>

      <AdminClientView
        stats={data.stats}
        products={data.recentProducts}
        orders={data.recentOrders}
      />
    </div>
  );
}
