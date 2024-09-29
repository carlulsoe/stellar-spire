import { parseWithZod } from '@conform-to/zod'
import { invariant } from '@epic-web/invariant'
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
	ChapterEditorSchema,
} from './__chapter-editor'


export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const urlList = request.url.split('/') /* ['http:', '', 'localhost:3001', 'users', 'carluc', 'stories', 'cm1l0eis80001bmgpk94f9ud5', 'chapter', 'new'] */
	const storyId = urlList[urlList.length - 3]

	invariant(storyId, 'storyId is required')
	invariant(typeof storyId === 'string', 'storyId is required')


	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	const submission = await parseWithZod(formData, {
		schema: ChapterEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const chapter = await prisma.chapter.findUnique({
				select: { id: true, number: true },
				where: { id: data.id, storyId },
			})
			if (!chapter) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Chapter not found',
				})
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
		id: chapterId,
		title,
		content,
		chapterNumber,
	} = submission.value


	const updatedChapter = await prisma.chapter.upsert({
		select: { id: true },
		where: { id: chapterId ?? '__new_chapter__' },
		create: {
			story: { connect: { id: storyId } },
			title,
			content,
			number: 0,
		},
		update: {
			title,
			content,
		},
	})

	return redirect(
		`/users/${userId}/stories/${storyId}/chapter/${updatedChapter.id}`,
	)
}
