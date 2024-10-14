import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button.js'
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

export function StoryCarousel({ stories, title }: { stories: any[], title: string }) {
	return (
		<div className="container mx-auto mb-8 mt-8 px-4">
			<h2 className="mb-4 text-2xl font-bold">{title}</h2>
				<Carousel
					opts={{
						align: 'start',
					}}
					className="w-full"
				>
					<CarouselContent>
						{stories.map((story) => (
							<CarouselItem
								key={story.id}
								className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
							>
								<Card className="w-full">
									<CardHeader>
										<CardTitle className="h-12 line-clamp-3">{story.title}</CardTitle>
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
	)
}