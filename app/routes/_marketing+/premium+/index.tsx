import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import PricingPageComponent from '#app/components/pricing-page'
import { CONFIG } from '#app/config.js'
import { requireUserId } from '#app/utils/auth.server.js'


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await requireUserId(request)
	return { user }
}

export const meta: MetaFunction = () => [{ title: CONFIG.SITENAME + ' Premium' }]

export default function PremiumPage() {
	const tiers = [
		{
		  name: "Supporter",
		  monthlyPrice: 9.99,
		  yearlyPrice: (9.99*10),
		  description: "For those who want to support the " + CONFIG.SITENAME + " community",
		  features: [
			"Supporting the " + CONFIG.SITENAME + " community",
			"Helps keep the lights on and ads free",
			"A badge on your profile",
		  ],
		  cta: "Support the Community",
		  link: "/premium",
		  popular: true,
		},
		{
		  name: "Super Supporter",
		  monthlyPrice: 49.99,
		  yearlyPrice: (49.99*10),
		  description: "For the Super Supporters who can go beyond their limits",
		  features: [
			"Supporting the " + CONFIG.SITENAME + " community",
			"Helps keep the lights on and ads free",
			"An even cooler badge on your profile",
		  ],
		  cta: "Power Up",
		  link: "/premium",
		  popular: false,
		},
		{
		  name: "Legendary Super Supporter",
		  monthlyPrice: 99.99,
		  yearlyPrice: (99.99*10),
		  description: "For the rare Legendary Super Supporters that is fully powered up and can go beyond their limits",
		  features: [
			"Supporting the " + CONFIG.SITENAME + " community",
			"Helps keep the lights on and ads free",
			"The coolest badge on your profile",
		  ],
		  cta: "Go Further Beyond",
		  link: "/premium",
		  popular: false,
		},
	  ]
	return (
		<main className="font-poppins">
			<PricingPageComponent tiers={tiers} />
		</main>
	)
}


