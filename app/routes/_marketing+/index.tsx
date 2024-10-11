import { invariantResponse } from '@epic-web/invariant'
import {
	type MetaFunction,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
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
import { Button } from '#app/components/ui/button.js'
import { getRecommendedStories } from '#app/utils/story-recommender.server.ts'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink' }]


export async function loader({ request }: LoaderFunctionArgs) {
	// Assume we have a way to get the current user's ID from the request
	const userId = await getUserId(request)
	const recommendedStories = userId ? await getRecommendedStories(userId, 10) : []

	invariantResponse(recommendedStories, 'Recommended stories not found', {
		status: 404,
	})

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
											<CardContent className="max-h-28 min-h-28">
												<p className="mb-4 text-sm line-clamp-4">{story.description}</p>
											</CardContent>
											<CardFooter>
												<Button>
													<Link
														to={`/stories/${story.id}`}
													>
														Read more
													</Link>
												</Button>
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
				<Carousel
					opts={{
						align: 'start',
					}}
					className="w-full"
				>
					<CarouselContent>
						{popularStories.map((story) => (
							<CarouselItem
								key={story.id}
								className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
							>
								<Card className="w-full">
									<CardHeader>
										<CardTitle>{story.title}</CardTitle>
										<CardDescription>
											by {story.author.name}
										</CardDescription>
									</CardHeader>
									<CardContent className="max-h-28 min-h-28">
										<p className="mb-4 text-sm line-clamp-4">{story.description}</p>
									</CardContent>
									<CardFooter>
										<Button>
											<Link
												to={`/stories/${story.id}`}
											>
												Read more
											</Link>
										</Button>
									</CardFooter>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
			<div className="container mx-auto mb-8 mt-8 px-4">
				<h2 className="mb-4 text-2xl font-bold">Recently Updated Stories</h2>
				<Carousel
					opts={{
						align: 'start',
					}}
					className="w-full"
				>
					<CarouselContent>
						{recentlyUpdatedStories.map((story) => (
							<CarouselItem
								key={story.id}
								className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
							>
								<Card className="w-full">
									<CardHeader>
										<CardTitle>{story.title}</CardTitle>
										<CardDescription>
											by {story.author.name}
										</CardDescription>
									</CardHeader>
									<CardContent className="max-h-28 min-h-28">
										<p className="mb-4 text-sm line-clamp-4">{story.description}</p>
									</CardContent>
									<CardFooter>
										<Button>
											<Link
												to={`/stories/${story.id}`}
											>
												Read more
											</Link>
										</Button>
									</CardFooter>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</main>
	)
}
