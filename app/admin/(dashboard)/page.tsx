import React from "react";
import { getDashboardData } from "@/app/lib/actions/admin";
import AdminClientView from "./(components)/AdminClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <AdminClientView
        stats={data.stats}
        products={data.recentProducts}
        orders={data.recentOrders}
      />
    </div>
  );
}
