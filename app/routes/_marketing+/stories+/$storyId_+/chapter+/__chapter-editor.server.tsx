import { parseWithZod } from '@conform-to/zod'
import { invariant, invariantResponse } from '@epic-web/invariant'
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
import { updateStoryEmbedding } from '#app/utils/story-recommender.server.ts'
import { filter } from '#app/utils/toxicity-filter.server.js'
import {
	MAX_UPLOAD_SIZE,
	ChapterEditorSchema,
} from './__chapter-editor'


export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	invariant(userId, 'userId is required')

	const urlList = request.url.split('/') /* e.g. ['http:', '', 'localhost:3001', 'users', 'carluc', 'stories', 'cm1l0eis80001bmgpk94f9ud5', 'chapter', 'new'] */
	const storyId = urlList[urlList.length - 3]
	invariant(storyId, 'storyId is required')
	invariant(typeof storyId === 'string', 'storyId is required')

	const authorId = await prisma.story.findUnique({
		select: { authorId: true },
		where: { id: storyId },
	})
	invariant(authorId, 'authorId is required')
	invariantResponse(authorId.authorId === userId, 'You are not the author of this story', { status: 403 })

	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	const submission = await parseWithZod(formData, {
		schema: ChapterEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const chapter = await prisma.chapter.findUnique({
				select: { id: true },
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
	} = submission.value

	const toxicityResult = await filter.analyzeContent(content)

	const updatedChapter = await prisma.chapter.upsert({
		select: { id: true },
		where: { id: chapterId ?? '__new_chapter__' },
		create: {
			story: { connect: { id: storyId } },
			title,
			content,
			number: await prisma.chapter.count({
				where: { storyId }
			}) + 1,
			isAcceptable: toxicityResult.isAcceptable,
		},
		update: {
			title,
			content,
			isAcceptable: toxicityResult.isAcceptable,
		},
	})

	// if the chapter is not acceptable, set the story to not acceptable
	if (!toxicityResult.isAcceptable) {
		await prisma.story.update({
			where: { id: storyId },
			data: { isAcceptable: false },
		})
	}

	const story = await prisma.story.findUnique({
		where: { id: storyId },
	})
	invariant(story, 'story is required')

	await updateStoryEmbedding(story)
	
	return redirect(
		`/stories/${storyId}/chapter/${updatedChapter.id}`,
	)
}
