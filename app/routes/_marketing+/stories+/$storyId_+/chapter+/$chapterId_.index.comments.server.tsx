import { parseWithZod } from '@conform-to/zod'
import { invariant, invariantResponse } from '@epic-web/invariant'
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node'
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
  //console.log("Action started")
  try {
    const userId = await requireUserId(request)
    const { chapterId } = params
    invariant(chapterId, "chapterId is required")

    const formData = await request.formData()
    //console.log("Form data:", formData)

    const submission = parseWithZod(formData, {
      schema: CommentSchema,
    })
    //console.log("Submission result:", submission)

    if (submission.status !== 'success') {
      console.log("Submission failed:", submission.error)
      return json(
        { result: submission.reply() },
        { status: submission.status === 'error' ? 400 : 200 },
      )
    }

    const { content, parentId } = submission.value
    //console.log("Creating comment with:", { content, parentId, userId, chapterId })

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        chapterId,
        ...(parentId ? { parentId } : {}),
      },
    })
    console.log("Comment created:", comment)

    //const allComments = await prisma.comment.findMany({ where: { chapterId } })
    //console.log("All comments after creation:", allComments)

    return redirect(`/stories/${params.storyId}/chapter/${chapterId}/`)
  } catch (error) {
    console.error("Error in action:", error)
    throw error
  }
}
