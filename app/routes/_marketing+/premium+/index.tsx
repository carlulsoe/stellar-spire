import { ActionFunctionArgs, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import PricingPageComponent from '#app/components/pricing-page'
import { requireUserId } from '#app/utils/auth.server.js'


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await requireUserId(request)
	return { user }
}

export const meta: MetaFunction = () => [{ title: 'Stellar Ink Premium' }]

export default function PremiumPage() {
	return (
		<main className="font-poppins">
			<PricingPageComponent />
		</main>
	)
}


