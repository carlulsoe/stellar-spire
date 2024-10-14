import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
} from '@remix-run/node'
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	type MetaFunction,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { ErrorList } from '#app/components/forms.tsx'
import { StoryOverviewComponent } from '#app/components/story-overview.js'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { requireUserWithPermission } from '#app/utils/permissions.server.ts'
import { ReadingTimeEstimator } from '#app/utils/readingTimeEstimate.js'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { userHasPermission, useOptionalUser } from '#app/utils/user.ts'
import { type loader as storiesLoader } from '../../../users+/$username_+/stories.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const story = await prisma.story.findUnique({
		where: { id: params.storyId },
		select: {
			id: true,
			title: true,
			description: true,
			authorId: true,
			author: { select: { username: true } },
			updatedAt: true,
			coverImage: {
				select: {
					id: true,
					altText: true,
				},
			},
			chapters: {
				select: {
					id: true,
					title: true,
					content: true,
					updatedAt: true,
					number: true,
				},
			},
		},
	})

	invariantResponse(story, 'Not found', { status: 404 })
	
	const date = new Date(story.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		story,
		timeAgo
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-story'),
	storyId: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: DeleteFormSchema,
	})
	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { storyId } = submission.value

	const story = await prisma.story.findFirst({
		select: { id: true, authorId: true, author: { select: { username: true } } },
		where: { id: storyId },
	})
	invariantResponse(story, 'Not found', { status: 404 })

	const isAuthor = story.authorId === userId
	await requireUserWithPermission(
		request,
		isAuthor ? `delete:story:own` : `delete:story:any`,
	)

	await prisma.story.delete({ where: { id: story.id } })

	return redirectWithToast(`/users/${story.author.username}/stories`, {
		type: 'success',
		title: 'Success',
		description: 'Your story has been deleted.',
	})
}

export default function StoryRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isAuthor = user?.id === data.story.authorId
	const canDelete = userHasPermission(
		user,
		isAuthor ? `delete:story:own` : `delete:story:any`,
	)
	const displayBar = canDelete || isAuthor

	return (
		<div className="flex flex-col px-10">
			<StoryOverviewComponent
				story={{
					...data.story,
					coverImage: data.story.coverImage,
				}}
				timeAgo={data.timeAgo}
				estimatedReadTime={data.story.chapters.reduce((total, chapter) => total + ReadingTimeEstimator.estimate(chapter.content).minutes, 0)}
				isAuthor={isAuthor}
			/>

			{displayBar ? (
				<div className={floatingToolbarClassName}>
					<span className="text-sm text-foreground/90 max-[524px]:hidden">
						<Icon name="clock" className="scale-125">
							{data.timeAgo} ago
						</Icon>
					</span>
					<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
						{canDelete ? <DeleteStory id={data.story.id} /> : null}
						<Button
							asChild
							className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
						>
							<Link to="edit">
								<Icon name="pencil-1" className="scale-125 max-md:scale-150">
									<span className="max-md:hidden">Edit</span>
								</Icon>
							</Link>
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}

export function DeleteStory({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-story',
		lastResult: actionData?.result,
	})

	return (
		<Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="storyId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-story"
				variant="destructive"
				status={isPending ? 'pending' : (form.status ?? 'idle')}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/stories': typeof storiesLoader }
> = ({ data, params, matches }) => {
	const storiesMatch = matches.find(
		(m) => m.id === 'routes/users+/$username_+/stories',
	)
	const displayName = storiesMatch?.data?.author.name ?? params.username
	const storyTitle = data?.story.title ?? 'Story'
	const storyDescription =
		data && data.story.description.length > 100
			? data?.story.description.slice(0, 97) + '...'
			: 'No content'
	return [
		{ title: `${storyTitle} | ${displayName}'s Stories | Stellar Ink` },
		{
			name: 'description',
			content: storyDescription,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No story with the id "{params.storyId}" exists</p>
				),
			}}
		/>
	)
}
