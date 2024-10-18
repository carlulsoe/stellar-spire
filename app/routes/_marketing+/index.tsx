import { invariantResponse } from '@epic-web/invariant'
import {
	type MetaFunction,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { StoryCarousel } from '#app/components/story-carousel.tsx'
import { getUserId } from '#app/utils/auth.server.js'
import { prisma } from '#app/utils/db.server.ts'
import { getRecommendedStories } from '#app/utils/story-recommender.server.ts'
import { cachified, lruCache } from '#app/utils/cache.server.js'
import { CONFIG } from '#app/config.js'

export const meta: MetaFunction = () => [{ title: CONFIG.SITENAME }]


export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await getUserId(request)
	let recommendedStories: any[] = []

	if (userId) {
		recommendedStories = await cachified({
			ttl: 1000 * 60, // 1 minute
			swr: 1000 * 60 * 5, // 5 minutes
			cache: lruCache,
			key: userId+'-recommendedStories',
			getFreshValue: () => getRecommendedStories(userId, 10),
		})
		
		if (recommendedStories.length > 0) {
			const storiesWithAuthors = await prisma.story.findMany({
				where: { id: { in: recommendedStories.map(story => story.id) } },
				select: {
					id: true,
					author: { select: { name: true } }
				}
			})

			const authorMap = new Map(storiesWithAuthors.map(story => [story.id, story.author.name]))

			recommendedStories = recommendedStories.map(story => ({
				...story,
				author: { name: authorMap.get(story.id) || '' }
			}))
		}
	}

	const popularStories = await prisma.story.findMany({
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					name: true,
					username: true,
				},
			},
		},
		orderBy: {
			views: 'desc',
		},
		take: 10,
	})

	invariantResponse(popularStories, 'Popular stories not found', {
		status: 404,
	})

	const recentlyUpdatedStories = await prisma.story.findMany({
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			author: { select: { id: true, name: true, username: true } },
		},
		orderBy: { createdAt: 'desc' },
		take: 10,
	})

	invariantResponse(
		recentlyUpdatedStories,
		'Recently updated stories not found',
		{ status: 404 },
	)

	return json({ recommendedStories, popularStories, recentlyUpdatedStories })
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const recommendedStories = data.recommendedStories
	const popularStories = data.popularStories
	const recentlyUpdatedStories = data.recentlyUpdatedStories
	return (
		<main className="font-poppins grid h-full place-items-center">
			{recommendedStories.length > 0 && (
				<StoryCarousel stories={recommendedStories} title="Recommended Stories" />
			)}
			<StoryCarousel stories={popularStories} title="Popular Stories" />
			<StoryCarousel stories={recentlyUpdatedStories} title="Recently Updated Stories" />
		</main>
	)
}
