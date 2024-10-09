import { invariant, invariantResponse } from "@epic-web/invariant"
import { type LoaderFunctionArgs, type ActionFunctionArgs , json } from "@remix-run/node"
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react"
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import { Avatar, AvatarFallback, AvatarImage } from "#app/components/ui/avatar"
import { Button } from "#app/components/ui/button"
import { Textarea } from "#app/components/ui/textarea"
import { requireUserId } from "#app/utils/auth.server.js"
import { prisma } from "#app/utils/db.server"

type Comment = {
  id: string
  author: {
    username: string
    image?: {
      id: string
    } | null
  }
  content: string
  score: number
  replies: Comment[]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const comments = await prisma.comment.findMany({
    where: { parentId: null },
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
  })
  if (comments.length === 0) {
    return json({ comments: [], status: 404 })
  }
  return json({ comments, status: 200 })
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const content = formData.get("content")
  const parentId = formData.get("parentId")
  
  const userId = await requireUserId(request)

  if (typeof content !== "string" || content.trim() === "") {
    return json({ error: "Content must be a non-empty string" }, { status: 400 })
  }

  const { chapterId } = params
  invariant(chapterId, "chapterId is required")

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: userId,
      chapterId,
      ...(parentId && typeof parentId === "string"
        ? { parentId }
        : {}),
    },
  })

  return json({ comment })
}

function CommentComponent({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [score, setScore] = useState(comment.score)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleUpvote = () => setScore(prevScore => prevScore + 1)
  const handleDownvote = () => setScore(prevScore => prevScore - 1)
  
  invariantResponse(comment.author.username[0], "Comment author username is required" , { status: 400 })
  invariantResponse(comment.author.image?.id, "Comment author image is required" , { status: 400 })
  return (
    <div className={`flex space-x-2 ${depth > 0 ? 'ml-6 mt-2' : 'mt-4'}`}>
      <div className="flex flex-col items-center space-y-1">
        <Button variant="ghost" size="icon" onClick={handleUpvote}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{score}</span>
        <Button variant="ghost" size="icon" onClick={handleDownvote}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`/resources/user-images/${comment.author.image?.id}`} />
            <AvatarFallback>{comment.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{comment.author.username}</span>
        </div>
        <p className="mt-1 text-sm">{comment.content}</p>
        <div className="mt-2 flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Reply
          </Button>
        </div>
        {showReplyForm && <CommentForm parentId={comment.id} />}
        {comment.replies.map(reply => (
          <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    </div>
  )
}

function CommentForm({ parentId }: { parentId?: string }) {
  const [content, setContent] = useState('')
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  // TODO: the comment does no upload to the database
  return (
    <Form method="post" className="mt-4">
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts on the chapter?"
        className="min-h-[100px]"
      />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <Button type="submit" className="mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Comment"}
      </Button>
    </Form>
  )
}

export default function CommentsRoute() {
  const { comments, status } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isReloading = navigation.state === "loading"

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comments</h1>
      <CommentForm />
      {isReloading ? (
        <p>Loading comments...</p>
      ) : status === 200 ? (
        comments.map(comment => (
          <CommentComponent key={comment.id} comment={comment as unknown as Comment} />
        ))
      ) : (
        <p>No comments yet, be the first to comment!</p>
      )}
    </div>
  )
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No comments found for this chapter</p>
				),
			}}
		/>
	)
}