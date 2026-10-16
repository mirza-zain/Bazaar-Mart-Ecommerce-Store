import React from "react";
import { getAllProductsAction } from "@/app/lib/actions/admin";
import ProductsManager from "./(components)/ProductsManager";

export const instant = false;

export default async function ManageProductsPage() {
  const allProducts = await getAllProductsAction();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Manage Products
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Catalog inventory, stock levels, quick pricing adjustments, and Cloudinary uploads.
        </p>
      </div>

      <ProductsManager initialProducts={allProducts} />
    </div>
  );
}
