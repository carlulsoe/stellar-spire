import { parseWithZod } from '@conform-to/zod'
import { invariant, invariantResponse } from '@epic-web/invariant'
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { CommentSchema } from './$chapterId_.index.comments'


export async function loader({ params }: LoaderFunctionArgs) {
  const { chapterId } = params
  invariantResponse(chapterId, "chapterId is required", { status: 400 })
  const comments = await prisma.comment.findMany({
    where: { chapterId },
    include: {
      author: {
        select: {
          username: true,
          image: {
            select: {
              id: true,
            },
          },
        },
      },
      replies: {
        include: {
          author: {
            select: {
              username: true,
              image: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
    take: 10,
    orderBy: {
      score: "desc"
    }
  })
  if (comments.length === 0) {
    return json({ comments: [], status: 404 })
  }
  return json({ comments, status: 200 })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request)
  const { chapterId } = params
  invariant(chapterId, "chapterId is required")

  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    schema: CommentSchema,
  })

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 },
    )
  }

  const { content, parentId } = submission.value

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: userId,
      chapterId,
      ...(parentId ? { parentId } : {}),
    },
  })

  return json({ comment })
}
