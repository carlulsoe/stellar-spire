import { invariantResponse } from '@epic-web/invariant'
import { type MetaFunction, json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { prisma } from '#app/utils/db.server.ts'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink' }]

export async function loader({ params }: LoaderFunctionArgs) {
	// Assume we have a way to get the current user's ID from the request
	const userId = params.userId

	// Fetch the current user's interactions and similar users
	const userWithInteractions = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			storyInteractions: {
				where: { type: { in: ['like', 'rate'] } },
				include: { story: true },
			},
			similaritiesAsUser2: {
				orderBy: { similarity: 'desc' },
				take: 10,
				include: {
					user1: {
						include: {
							storyInteractions: {
								where: { type: { in: ['like', 'rate'] } },
								include: { story: true },
							},
						},
					},
				},
			},
		},
	})

	invariantResponse(userWithInteractions, 'User not found', { status: 404 })

	// Calculate recommendations based on similar users' interactions
	const recommendedStoryIds = new Set<string>()
	const userInteractedStoryIds = new Set(userWithInteractions.storyInteractions.map(i => i.story.id))

	for (const similarity of userWithInteractions.similaritiesAsUser2) {
		for (const interaction of similarity.user1.storyInteractions) {
			if (!userInteractedStoryIds.has(interaction.story.id)) {
				recommendedStoryIds.add(interaction.story.id)
			}
			if (recommendedStoryIds.size >= 4) break
		}
		if (recommendedStoryIds.size >= 4) break
	}

	// Fetch full details of recommended stories
	const recommendedStories = await prisma.story.findMany({
		where: { id: { in: Array.from(recommendedStoryIds) } },
		select: {
			id: true,
			title: true,
			content: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					name: true,
					username: true,
				},
			},
		},
	})

	invariantResponse(recommendedStories, 'Recommended stories not found', { status: 404 })
	// We only want to show the 4 most popular stories
	const popularStories = await prisma.story.findMany({
		select: {
			id: true,
			title: true,
			content: true,
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
			likesCount: 'desc',
		},
		take: 4,
	})

	invariantResponse(popularStories, 'Popular stories not found', { status: 404 })

	return json({ recommendedStories, popularStories })
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const recommendedStories = data.recommendedStories;
	const popularStories = data.popularStories;
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="container mx-auto px-4">
				<h2 className="text-2xl font-bold mb-4">Recommended Stories</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
					{recommendedStories.map((story) => (
						<Card key={story.id} className="w-[320px]">
							<CardHeader>
								<CardTitle>{story.title}</CardTitle>
								<CardDescription>{story.author.name}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm mb-4">{story.content}</p>
							</CardContent>
							<CardFooter>
								<a href="#" className="text-blue-500 hover:underline">Read more</a>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
			<div className="container mx-auto px-4 mt-8 mb-8">
				<h2 className="text-2xl font-bold mb-4">Popular Stories</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
					{popularStories.map((story) => (
						<Card key={story.id} className="w-[320px]">
							<CardHeader>
								<CardTitle>{story.title}</CardTitle>
								<CardDescription>{story.author.name}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm mb-4">{story.content}</p>
							</CardContent>
							<CardFooter>
								<a href="#" className="text-blue-500 hover:underline">Read more</a>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</main>
	)
}
