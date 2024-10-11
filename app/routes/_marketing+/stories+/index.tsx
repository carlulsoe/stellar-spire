import { type LoaderFunctionArgs } from '@remix-run/node'
import { json, Link, redirect, useLoaderData, type MetaFunction } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.js'
import { ErrorList } from '#app/components/forms.js'
import { SearchBar } from '#app/components/search-bar.js'
import { CONFIG } from '#app/config.ts'
import { prisma } from '#app/utils/db.server.js'
import { getUserImgSrc, useDelayedIsPending , cn } from '#app/utils/misc.js'
import { type loader as storiesLoader } from '../../users+/$username_+/stories.tsx'

const StorySearchResultSchema = z.object({
	id: z.string(),
	title: z.string(),
	createdAt: z.date(),
	authorId: z.string(),
	authorUsername: z.string(),
	authorImageId: z.string().nullable(),
})

const StorySearchResultsSchema = z.array(StorySearchResultSchema)

export async function loader({ request }: LoaderFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search')
	if (searchTerm === '') {
		return redirect('/stories')
	}

	const like = `%${searchTerm ?? ''}%`
	const rawStories = await prisma.$queryRaw`
		SELECT Story.id, Story.title, Story.createdAt, Story.authorId, User.username AS authorUsername, UserImage.id AS authorImageId
		FROM Story
		JOIN User ON Story.authorId = User.id
		LEFT JOIN UserImage ON User.id = UserImage.userId
		WHERE Story.title LIKE ${like}
		ORDER BY Story.createdAt DESC
		LIMIT 50
	`

	const result = StorySearchResultsSchema.safeParse(rawStories)
	if (!result.success) {
		return json({ status: 'error', error: result.error.message } as const, {
			status: 400,
		})
	}
	return json({ status: 'idle', stories: result.data } as const)
}

export default function StoriesRoute() {
	const data = useLoaderData<typeof loader>()
	const isPending = useDelayedIsPending({
		formMethod: 'GET',
		formAction: '/stories',
	})

	if (data.status === 'error') {
		console.error(data.error)
	}

	return (
		<div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
			<h1 className="text-h1">{CONFIG.SITENAME} Stories</h1>
			<div className="w-full max-w-[700px]">
				<SearchBar status={data.status} autoFocus autoSubmit />
			</div>
			<main>
				{data.status === 'idle' ? (
					data.stories.length ? (
						<ul
							className={cn(
								'flex w-full flex-wrap items-center justify-center gap-4 delay-200',
								{ 'opacity-50': isPending },
							)}
						>
							{data.stories.map((story) => (
								<li key={story.id}>
									<Link
										to={`/stories/${story.id}`}
										className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
									>
										<img
											alt={story.authorUsername}
											src={getUserImgSrc(story.authorImageId)}
											className="h-16 w-16 rounded-full"
										/>
										<span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
											{story.title}
										</span>
										<span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
											by {story.authorUsername}
										</span>
									</Link>
								</li>
							))}
						</ul>
					) : (
						<p>No stories found</p>
					)
				) : data.status === 'error' ? (
					<ErrorList errors={['There was an error parsing the results']} />
				) : null}
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}

export const meta: MetaFunction<
	null,
	{ 'routes/_marketing+/stories+': typeof storiesLoader }
> = ({ params, matches }) => {
	const storiesMatch = matches.find(
		(m) => m.id === 'routes/_marketing+/stories+',
	)
	const displayName = storiesMatch?.data?.author.name ?? params.username
	const storyCount = storiesMatch?.data?.author.stories.length ?? 0
	const storiesText = storyCount === 1 ? 'story' : 'stories'
	return [
		{ title: `${displayName}'s Stories | ${CONFIG.SITENAME}` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${storyCount} ${storiesText} on ${CONFIG.SITENAME}`,
		},
	]
}
