"use client"

import { INVESTMENT_PLANS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function InvestmentPlans() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Investment Plan</h2>
        <p className="text-muted-foreground">Select a plan and start earning returns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INVESTMENT_PLANS.map((plan, index) => (
          <Card
            key={plan.id}
            className="bg-card border-border hover:border-accent/50 transition-all animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-accent-thick">{plan.name}</CardTitle>
                <div className="text-3xl">💰</div>
              </div>
              <CardDescription>
                <span className="text-xl font-bold text-foreground">{plan.returnPercentage}%</span>
                <span className="text-muted-foreground ml-2">After {plan.durationDays} days</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-secondary border border-border p-3 rounded">
                <p className="text-sm text-muted-foreground mb-2">Investment Range</p>
                <p className="font-semibold text-foreground">
                  ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-foreground">Referral: {plan.referralPercentage}%</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-foreground">
                    Principal: {plan.principalIncluded ? "Included" : "Not Included"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-foreground">Payments: {plan.paymentsInstant ? "Instant" : "Scheduled"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-foreground">Support: {plan.onlineSupport ? "24/7" : "Business Hours"}</span>
                </div>
              </div>

              <Button className="w-full bg-accent-thick hover:bg-accent-thick/90 text-accent-foreground">Choose Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
