import { invariantResponse } from "@epic-web/invariant"
import { type Story } from "@prisma/client"
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import StoryPage from "#app/components/story-page.js"
import { getUserId, requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from "#app/utils/db.server.js"
import { getRecommendedStories, recordUserRead } from "#app/utils/story-recommender.server.ts"


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
			isAcceptable: true,
			story: {
				select: {
					author: {
						select: {
							username: true
						}
					},
					title: true,
				}
			}
		},
	})

	// If chapter is not found, throw a 404 error
	invariantResponse(chapter, 'Chapter not found', { status: 404 })
	// if the chapter is not acceptable, throw a 404 error
	invariantResponse(chapter.isAcceptable === false, 'Chapter not found', { status: 404 })

	const userId = await getUserId(request)
	if (userId) {
		await recordUserRead(userId, storyId)
	}

	let isFollowed = null
	if (userId) {
		isFollowed = await prisma.follows.findFirst({
			where: { followerId: userId, storyId },
		})
	}

	const nextChapter = await prisma.chapter.findFirst({
		where: { storyId: params.storyId, number: chapter.number + 1 },
		select: { id: true },
	})
	// if it is the last chapter, get some suggested Stories
	let suggestedStories: Story[] = []
	if (!nextChapter) {
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
		storyTitle: chapter.story.title,
		author: chapter.story.author.username,
		previousChapterId: previousChapter?.id ?? null,
		chapter,
		nextChapterId: nextChapter?.id ?? null,
		isFollowed: !!isFollowed,
		totalChapters,
		suggestedStories,
	})
}

export default function ChapterRoute() {
	const data = useLoaderData<typeof loader>()
	
	return (
		<StoryPage storyData={data} suggestedStories={data.suggestedStories as unknown as Story[]} isFollowed={data.isFollowed}/>
	)
}

export async function action({ request, params }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const { storyId } = params

	invariantResponse(storyId, 'Not found', { status: 404 })

	const existingFollow = await prisma.follows.findFirst({
		where: {
			followerId: userId,
			storyId,
		},
	})

	if (existingFollow) {
		await prisma.follows.delete({
			where: { id: existingFollow.id },
		})
	} else {
		await prisma.follows.create({
			data: {
				followerId: userId,
				storyId,
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