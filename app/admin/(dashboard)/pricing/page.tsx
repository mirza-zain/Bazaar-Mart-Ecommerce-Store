import React from "react";
import { getDiscountCodesAction } from "@/app/lib/actions/admin";
import { getShippingRulesAction } from "@/app/lib/actions/shipping";
import PricingAndShippingManager from "./(components)/PricingAndShippingManager";

export const instant = false;

export default async function PricingRulesPage() {
  const [codes, shippingRules] = await Promise.all([
    getDiscountCodesAction(),
    getShippingRulesAction(),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <PricingAndShippingManager
        initialCodes={codes}
        initialShippingRules={shippingRules}
      />
    </div>
  );
}

