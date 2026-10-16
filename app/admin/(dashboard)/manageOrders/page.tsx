import React from "react";
import { getAllOrdersAction } from "@/app/lib/actions/admin";
import OrdersManager from "./(components)/OrdersManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManageOrdersPage() {
  const allOrders = await getAllOrdersAction();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Manage Orders
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review customer shipments, verify bank transfer receipts, and update order fulfillments.
        </p>
      </div>

      <OrdersManager initialOrders={allOrders} />
    </div>
  );
}
