import { ActionFunctionArgs, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare'
import PricingPageComponent from '#app/components/pricing-page'
import { requireUserId } from '#app/utils/auth.server.js'
import { CONFIG } from '#app/config.js'


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await requireUserId(request)
	return { user }
}

export const meta: MetaFunction = () => [{ title: CONFIG.SITENAME + ' Premium' }]

export default function PremiumPage() {
	const tiers = [
		{
		  name: "Supporter",
		  monthlyPrice: 4.99,
		  yearlyPrice: (4.99*6),
		  description: "For those who want to support the " + CONFIG.SITENAME + " community",
		  features: [
			"Supporting the " + CONFIG.SITENAME + " community",
		  ],
		  cta: "Support the Community",
		  popular: false,
		},
		{
		  name: "Author",
		  monthlyPrice: 14.99,
		  yearlyPrice: (14.99*10),
		  description: "Ideal for serious writers aiming for publication",
		  features: [
			"Advanced AI-powered editing suggestions",
			"Character development tools",
			"Plot structure analyzer",
			"Beta reader management system",
		  ],
		  cta: "Elevate Your Craft",
		  popular: true,
		},
		{
		  name: "Pro",
		  monthlyPrice: 49.99,
		  yearlyPrice: (49.99*10),
		  description: "For established authors and writing professionals",
		  features: [
			"Everything in Author",
			"Collaboration tools for co-authors",
			"Marketing and book promotion tools",
			"Royalty tracking and analytics",
			"Priority support from writing experts",
		  ],
		  cta: "Unlock Your Potential",
		  popular: false,
		},
	  ]
	return (
		<main className="font-poppins">
			<PricingPageComponent tiers={tiers} />
		</main>
	)
}


