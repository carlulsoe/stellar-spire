'use client'

import { Check } from "lucide-react"
import { Button } from "#app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#app/components/ui/card"

export function PricingPageComponent() {
  const tiers = [
    {
      name: "Basic",
      price: "$9.99",
      description: "Perfect for individuals and small projects",
      features: [
        "1 user",
        "5 projects",
        "5GB storage",
        "Basic support",
      ],
      cta: "Start Basic",
    },
    {
      name: "Premium",
      price: "$29.99",
      description: "Ideal for growing teams and businesses",
      features: [
        "5 users",
        "20 projects",
        "50GB storage",
        "Priority support",
        "Advanced analytics",
      ],
      cta: "Upgrade to Premium",
      popular: true,
    },
    {
      name: "Ultimate",
      price: "$99.99",
      description: "For large-scale operations and organizations",
      features: [
        "Unlimited users",
        "Unlimited projects",
        "1TB storage",
        "24/7 dedicated support",
        "Custom integrations",
        "SLA guarantees",
      ],
      cta: "Get Started",
    },
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Choose the Right Plan for You
          </h2>
          <p className="mt-4 text-xl">
            Unlock advanced features and enhance your writing experience
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col justify-between ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                  {tier.price}
                  <span className="ml-1 text-2xl font-medium text-gray-500">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}