import { Link } from "@remix-run/react"
import { Check } from "lucide-react"
import { type SetStateAction, useState } from "react"
import { Button } from "#app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#app/components/ui/tabs"
export default function PricingPageComponent(props: {
  tiers: {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    features: string[];
    cta: string;
    link: string;
    popular: boolean;
  }[];
}) {
  const [billingPeriod, setBillingPeriod] = useState("monthly")
/* TODO: Add a loader to check if the user is already subscribed */
  const tiers = props.tiers

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Choose Your Journey
          </h2>
          <p className="mt-4 text-xl">
            Unlock the tools you need to bring your stories to life
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
                <Tabs value={billingPeriod} className="w-full" onValueChange={(value: SetStateAction<string>) => setBillingPeriod(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold">${tier.monthlyPrice}</div>
                      <div className="mt-1 text-xl text-gray-500">/month</div>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold">${tier.yearlyPrice.toFixed(2)}</div>
                      <div className="mt-1 text-xl">/year</div>
                      <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        Save {((tier.monthlyPrice * 12 - tier.yearlyPrice) / (tier.monthlyPrice * 12) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature: string) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="ml-3 text-base">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to={`/premium/not-implemented?tier=${tier.name.toLowerCase()}`} className="w-full"> {/* TODO: add the different tiers */}
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    {tier.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}