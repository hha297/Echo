'use client';

import { PricingTable } from '../components/pricing-table';

export const BillingViews = () => {
        return (
                <div className="flex min-h-screen flex-col bg-muted p-8">
                        <div className="mx-auto w-full max-screen-md">
                                <div className="space-y-2">
                                        <h1 className="text-2xl md:text-4xl font-bold">Plan & Billing</h1>
                                        <p className="text-sm text-muted-foreground">
                                                Choose the plan that's right for you
                                        </p>
                                </div>
                                <div className="mt-8">
                                        <PricingTable />
                                </div>
                        </div>
                </div>
        );
};
