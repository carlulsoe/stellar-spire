import { invariantResponse } from "@epic-web/invariant"
import { type Chapter } from "@prisma/client"
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import { StoryReaderComponent } from "#app/components/story-reader.js"
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from "#app/utils/db.server.js"
import CommentsRoute from "./$chapterId_.index.comments"


export async function loader({ params }: LoaderFunctionArgs) {
	const { storyId, chapterId } = params

	// Ensure both storyId and chapterId are present
	invariantResponse(storyId && chapterId, 'Invalid story or chapter ID', { status: 400 })

	const chapter = await prisma.chapter.findUnique({
		where: { id: chapterId },
		select: {
			id: true,
			title: true,
			content: true,
			updatedAt: true,
			number: true,
			story: {
				select: {
					author: {
						select: {
							username: true
						}
					}
				}
			}
		},
	})

	// If chapter is not found, throw a 404 error
	invariantResponse(chapter, 'Chapter not found', { status: 404 })

	const isLiked = await prisma.likes.findFirst({
		where: {
			userId: params.userId,
			chapterId: params.chapterId,
		},
	})

	const nextChapter = await prisma.chapter.findFirst({
		where: { storyId: params.storyId, number: chapter.number + 1 },
		select: { id: true },
	})

	const previousChapter = await prisma.chapter.findFirst({
		where: { storyId: params.storyId, number: chapter.number - 1 },
		select: { id: true },
	})

	const totalChapters = await prisma.chapter.count({
		where: { storyId: params.storyId },
	})

	return json({
		storyId,
		author: chapter.story.author.username,
		previousChapterId: previousChapter?.id ?? null,
		chapter,
		nextChapterId: nextChapter?.id ?? null,
		isLiked: !!isLiked,
		totalChapters
	})
}

export default function ChapterRoute() {
	const data = useLoaderData<typeof loader>()
	
	return (
		<div>
			<StoryReaderComponent
				storyId={data.storyId}
				author={data.author}
				chapter={data.chapter}
				nextChapterId={data.nextChapterId}
				previousChapterId={data.previousChapterId}
				isLiked={data.isLiked}
				totalChapters={data.totalChapters}
			/>
			<div className="flex-1">
				<CommentsRoute />
			</div>
		</div>
	)
}

export async function action({ request, params }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const { chapterId } = params
	
	invariantResponse(chapterId, 'Not found', { status: 404 })

	const existingLike = await prisma.likes.findFirst({
		where: {
			userId,
			chapterId,
		},
	})

	if (existingLike) {
		await prisma.likes.delete({
			where: { id: existingLike.id },
		})
	} else {
		await prisma.likes.create({
			data: {
				userId,
				chapterId,
			},
		})
	}

	return json({ success: true })
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