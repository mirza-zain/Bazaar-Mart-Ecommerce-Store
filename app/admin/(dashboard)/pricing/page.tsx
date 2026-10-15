import React from "react";
import { getDiscountCodesAction } from "@/app/lib/actions/admin";
import DiscountManager from "./(components)/DiscountManager";

export const instant = false;

export default async function PricingRulesPage() {
  const codes = await getDiscountCodesAction();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <DiscountManager initialCodes={codes} />
    </div>
  );
}

