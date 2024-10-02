import { invariantResponse } from '@epic-web/invariant'
import {
	type MetaFunction,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '#app/components/ui/carousel.tsx'
import { getUserId } from '#app/utils/auth.server.js'
import { prisma } from '#app/utils/db.server.ts'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink' }]
async function getRecommendedStories(userId: string) {
	invariantResponse(userId, 'User ID is required', { status: 400 })
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
	const userInteractedStoryIds = new Set(
		userWithInteractions.storyInteractions.map((i) => i.story.id),
	)

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
	return await prisma.story.findMany({
		where: { id: { in: Array.from(recommendedStoryIds) } },
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
	})
}

export async function loader({ request }: LoaderFunctionArgs) {
	// Assume we have a way to get the current user's ID from the request
	const userId = await getUserId(request)
	const recommendedStories = userId ? await getRecommendedStories(userId) : []

	invariantResponse(recommendedStories, 'Recommended stories not found', {
		status: 404,
	})
	// We only want to show the 4 most popular stories
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
			likesCount: 'desc',
		},
		take: 4,
	})

	invariantResponse(popularStories, 'Popular stories not found', {
		status: 404,
	})

	// Should show 4 recently updated stories
	const recentlyUpdatedStories = await prisma.story.findMany({
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			author: { select: { id: true, name: true, username: true } },
		},
		orderBy: { createdAt: 'desc' },
		take: 4,
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
				<>
					<h2 className="mb-4 text-2xl font-bold">Recommended Stories</h2>
					<Carousel
						opts={{
							align: 'start',
						}}
						className="w-full max-w-sm"
					>
						<CarouselContent>
							{recommendedStories.map((story) => (
								<CarouselItem
									key={story.id}
									className="md:basis-1/2 lg:basis-1/3"
								>
									<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
										<Card key={story.id} className="w-[320px]">
											<CardHeader>
												<CardTitle>{story.title}</CardTitle>
												<CardDescription>
													by {story.author.name}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<p className="mb-4 text-sm">{story.description}</p>
											</CardContent>
											<CardFooter>
												<a
													href={`/users/${story.author.username}/stories/${story.id}`}
													className="text-blue-500 hover:underline"
												>
													Read more
												</a>
											</CardFooter>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</>
			)}
			<div className="container mx-auto mb-8 mt-8 px-4">
				<h2 className="mb-4 text-2xl font-bold">Popular Stories</h2>
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{popularStories.map((story) => (
						<Card key={story.id} className="w-[320px]">
							<CardHeader>
								<CardTitle>{story.title}</CardTitle>
								<CardDescription>
									by {story.author.name}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-sm">{story.description}</p>
							</CardContent>
							<CardFooter>
								<a
									href={`/users/${story.author.username}/stories/${story.id}`}
									className="text-blue-500 hover:underline"
								>
									Read more
								</a>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
			<div className="container mx-auto mb-8 mt-8 px-4">
				<h2 className="mb-4 text-2xl font-bold">Recently Updated Stories</h2>
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{recentlyUpdatedStories.map((story) => (
						<Card key={story.id} className="w-[320px]">
							<CardHeader>
								<CardTitle>{story.title}</CardTitle>
								<CardDescription>
									by {story.author.name}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-sm">{story.description}</p>
							</CardContent>
							<CardFooter>
								<a
									href={`/users/${story.author.username}/stories/${story.id}`}
									className="text-blue-500 hover:underline"
								>
									Read more
								</a>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</main>
	)
}
