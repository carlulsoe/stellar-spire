import { parseWithZod } from '@conform-to/zod'
import { createId as cuid } from '@paralleldrive/cuid2'
import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	json,
	unstable_parseMultipartFormData as parseMultipartFormData,
	redirect,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
	MAX_UPLOAD_SIZE,
	StoryEditorSchema,
	type ImageFieldset,
} from './__story-editor'

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
	return image.id != null
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	const submission = await parseWithZod(formData, {
		schema: StoryEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const story = await prisma.story.findUnique({
				select: { id: true },
				where: { id: data.id, authorId: userId },
			})
			if (!story) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Story not found',
				})
			}
		}).transform(async ({ coverImage, ...data }) => {
			return {
				...data,
				coverImageUpdate: coverImage && imageHasId(coverImage) ? coverImage : undefined,
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const {
		id: storyId,
		title,
		description,
		coverImageUpdate,
	} = submission.value


	const updatedStory = await prisma.story.upsert({
		select: { id: true, author: { select: { username: true } } },
		where: { id: storyId ?? '__new_story__' },
		create: {
			authorId: userId,
			title,
			description,
			coverImage: coverImageUpdate && imageHasFile(coverImageUpdate)
				? {
						create: {
							altText: coverImageUpdate.altText,
							contentType: coverImageUpdate.file.type,
							blob: Buffer.from(await coverImageUpdate.file.arrayBuffer()),
						},
					}
				: undefined,
		},
		update: {
			title,
			description,
			coverImage: coverImageUpdate
				? {
						upsert: {
							create: {
								altText: coverImageUpdate.altText,
								contentType: coverImageUpdate.file?.type,
								blob: coverImageUpdate.file
									? Buffer.from(await coverImageUpdate.file.arrayBuffer())
									: undefined,
							},
							update: {
								altText: coverImageUpdate.altText,
								...(coverImageUpdate.file
									? {
											contentType: coverImageUpdate.file.type,
											blob: Buffer.from(await coverImageUpdate.file.arrayBuffer()),
										}
									: {}),
							},
						},
					}
				: undefined,
		},
	})

	return redirect(
		`/stories/${updatedStory.id}`,
	)
}
