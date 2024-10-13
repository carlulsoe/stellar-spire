import { invariantResponse } from "@epic-web/invariant"
import { type Story } from "@prisma/client"
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import StoryPage from "#app/components/story-page.js"
import { getUserId, requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from "#app/utils/db.server.js"
import { getRecommendedStories, recordUserRead } from "#app/utils/story-recommender.server.js"


export async function loader({ request, params }: LoaderFunctionArgs) {
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

	const userId = await getUserId(request)
	if (userId) {
		await recordUserRead(userId, storyId)
	}

	const nextChapter = await prisma.chapter.findFirst({
		where: { storyId: params.storyId, number: chapter.number + 1 },
		select: { id: true },
	})
	// if it is the last chapter, get some suggested Stories
	let suggestedStories: Story[] = []
	if (!nextChapter) {
		const userId = await getUserId(request)
		if (userId) {
			suggestedStories = await getRecommendedStories(userId, 3) as unknown as Story[]
		}
	}

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
		totalChapters,
		suggestedStories,
	})
}

export default function ChapterRoute() {
	const data = useLoaderData<typeof loader>()
	
	return (
		<StoryPage storyData={data} suggestedStories={data.suggestedStories as unknown as Story[]}/>
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