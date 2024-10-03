import { type MetaFunction } from '@remix-run/node'
import { PricingPageComponent } from '#app/components/pricing-page'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink Premium' }]

export default function PremiumPage() {
	return (
		<main className="font-poppins">
			<h1 className="text-center text-4xl font-bold mt-8 mb-4">Upgrade to Premium</h1>
			<p className="text-center text-xl mb-8">Unlock advanced features and enhance your writing experience</p>
			<PricingPageComponent />
		</main>
	)
}
