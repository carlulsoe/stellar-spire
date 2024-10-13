import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { StoryEditor } from '../../../users+/$username_+/__story-editor.tsx'

export { action } from '../../../users+/$username_+/__story-editor.server.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const story = await prisma.story.findFirst({
		select: {
			id: true,
			title: true,
			description: true,
			coverImage: {
				select: {
					id: true,
					altText: true,
				},
			},
		},
		where: {
			id: params.storyId,
			authorId: userId,
		},
	})
	invariantResponse(story, 'Not found', { status: 404 })
	return json({ story: story })
}

export default function StoryEdit() {
	const data = useLoaderData<typeof loader>()

	return <StoryEditor story={{
		...data.story,
		coverImage: data.story.coverImage ?? { id: '', altText: null },
	}} />
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No story with the id "{params.storyId}" exists</p>
				),
			}}
		/>
	)
}
