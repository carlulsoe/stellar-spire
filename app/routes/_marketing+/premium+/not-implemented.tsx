import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { CONFIG } from '#app/config.js'
import { requireUserId } from '#app/utils/auth.server.js'
import { prisma } from '#app/utils/db.server.js'


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await requireUserId(request)
    const url = new URL(request.url)
    const tier = url.searchParams.get('tier')
    // save the interest to the database
    invariantResponse(user, 'User not found')
    invariantResponse(tier, 'Tier not found')
    await prisma.premiumInterest.upsert({
        where: {
            userId_tier: {
                userId: user,
                tier: tier,
            },
        },
        update: {
            tier: tier,
        },
        create: {
            userId: user,
            tier: tier,
        }
    })

	return { user }
}

export const meta: MetaFunction = () => [{ title: CONFIG.SITENAME + ' Premium' }]

export default function NotImplementedPage() {
	return (
		<main className="font-poppins">
			<div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Thanks for your interest in {CONFIG.SITENAME} Premium!</h1>
				<p className="text-lg">{CONFIG.SITENAME} Premium is currently still getting written. Check back soon for updates!</p>
			</div>
		</main>
	)
}
