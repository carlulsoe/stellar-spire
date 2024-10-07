import { invariantResponse } from "@epic-web/invariant"
import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import { Button } from "#app/components/ui/button.js"
import { Icon } from "#app/components/ui/icon.js"
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from "#app/utils/db.server.js"
import CommentsRoute from "./$chapterId_.index.comments"


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

	const isLiked = await prisma.likes.findFirst({
		where: {
			userId: params.userId,
			chapterId: params.chapterId,
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
		isLiked,
	})
}

export default function ChapterRoute() {
	const data = useLoaderData<typeof loader>()
	return <div className="container pt-12">
		<h1 className="text-h1">Chapter {data.chapter.number}: {data.chapter.title}</h1>
		<p className="text-body-lg">by {data.username}</p>
		<div className="text-body-lg whitespace-break-spaces">{data.chapter.content}</div>
		<div className="flex justify-end gap-4">
			<Form method="POST">
				<Button variant="outline" size="lg" type="submit">
					<Icon name={data.isLiked ? "heart-filled" : "heart"} className="mr-2 h-5 w-5" />
					Like
				</Button>
			</Form>
			{data.nextChapter ? (
				<Button variant="outline" size="lg">
					<Link
						to={`/users/${data.username}/stories/${data.storyId}/chapter/${data.nextChapter.id}`}
					>
						Next Chapter
					</Link>
				</Button>
			) : null}
		</div>
		<div className="flex-1">
			<CommentsRoute />
		</div>
	</div>
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