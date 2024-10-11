import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react"
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from "#app/components/error-boundary.js"
import { Avatar, AvatarFallback, AvatarImage } from "#app/components/ui/avatar"
import { Button } from "#app/components/ui/button"
import { Textarea } from "#app/components/ui/textarea"
import { type action, type loader } from './$chapterId_.index.comments.server'

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
export const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
  parentId: z.string().optional(),
})

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
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, fields] = useForm({
    id: 'comment-form',
    constraint: getZodConstraint(CommentSchema),
    lastResult: actionData && 'result' in actionData ? actionData.result : undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CommentSchema })
    },
    shouldRevalidate: 'onBlur',
  })

  return (
    <Form method="post" className="mt-4" {...getFormProps(form)}>
      <Textarea
        {...getInputProps(fields.content, { type: 'text' })}
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
    <div className="max-w-3xl mx-auto">
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
        404: ({}) => (
          <p>No comments found for this chapter</p>
        ),
      }}
    />
  )
}