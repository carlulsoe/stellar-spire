import { invariantResponse } from "@epic-web/invariant"
import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import { prisma } from "#app/utils/db.server.js"

export async function loader({ params }: LoaderFunctionArgs) {
	const chapter = await prisma.chapter.findUnique({
		where: { id: params.chapterId },
		select: {
			id: true,
			title: true,
			content: true,
			updatedAt: true,
			number: true,
		},
	})

	invariantResponse(chapter, 'Not found', { status: 404 })
	
	const nextChapter = await prisma.chapter.findFirst({
		where: { storyId: params.storyId, number: chapter.number + 1 },
		select: { id: true },
	})

	return json({
		storyId: params.storyId,
		username: params.username,
		chapter,
		nextChapter,
	})
}

export default function ChapterRoute() {
	const data = useLoaderData<typeof loader>()
	return <div>
		<h1>{data.chapter.title}</h1>
		<div>{data.chapter.content}</div>
		{data.nextChapter ? (
			<Link
				to={`/users/${data.username}/stories/${data.storyId}/chapter/${data.nextChapter.id}`}
				className="mt-4 inline-block text-blue-600 hover:underline"
			>
				Next Chapter
			</Link>
		) : null}
	</div>
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No chapter with the id "{params.chapterId}" exists</p>
				),
			}}
		/>
	)
}