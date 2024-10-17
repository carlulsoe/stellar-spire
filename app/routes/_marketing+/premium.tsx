import { type MetaFunction } from '@remix-run/node'
import PricingPageComponent from '#app/components/pricing-page'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink Premium' }]

export default function PremiumPage() {
	return (
		<main className="font-poppins">
			<PricingPageComponent />
		</main>
	)
}
