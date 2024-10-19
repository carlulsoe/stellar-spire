/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import setCookieParser from 'set-cookie-parser'
import { expect, test } from 'vitest'
import { loader as rootLoader } from '#app/root.tsx'
import { getSessionExpirationDate, sessionKey } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { createUser, getUserImages, createComment, createStory } from '#tests/db-utils.ts'
import { default as CommentsRoute } from './$chapterId_.index.comments.tsx'
import { loader } from './$chapterId_.index.comments.server.tsx'
import { action } from './$chapterId_.index.comments.server.tsx'
import { fireEvent } from '@testing-library/react'
import { PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'


test('Renders comments correctly', async () => {
	const user_info = await createUser()
	const user = await prisma.user.create({ data: user_info })
	const story = await createStory(prisma, { authorId: user.id })
	const chapter = await prisma.chapter.create({
		data: {
			title: 'Test Chapter',
			content: 'Test content',
			storyId: story.id,
		},
	})
	const comment = await createComment(prisma, { authorId: user.id, chapterId: chapter.id })

	const App = createRemixStub([
		{
			path: '/stories/:storyId/chapter/:chapterId/comments',
			Component: CommentsRoute,
			loader,
			action,
		},
	])

	const routeUrl = `/stories/${chapter.storyId}/chapter/${chapter.id}/comments`
	render(<App initialEntries={[routeUrl]} />)

	await screen.findByText(comment.content)
	await screen.findByText(user.username)
})

test('Submits a new comment', async () => {
	const user_info = await createUser()
	const user = await prisma.user.create({ data: user_info })
	const story = await createStory(prisma, { authorId: user.id })
	const chapter = await prisma.chapter.create({
		data: {
			title: 'Test Chapter',
			content: 'Test content',
			storyId: story.id,
		},
	})

	const session = await prisma.session.create({
		select: { id: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
	})

	const authSession = await authSessionStorage.getSession()
	authSession.set(sessionKey, session.id)
	const setCookieHeader = await authSessionStorage.commitSession(authSession)
	const parsedCookie = setCookieParser.parseString(setCookieHeader)
	const cookieHeader = new URLSearchParams({
		[parsedCookie.name]: parsedCookie.value,
	}).toString()

	const App = createRemixStub([
		{
			id: 'root',
			path: '/',
			loader: async (args) => {
				// add the cookie header to the request
				args.request.headers.set('cookie', cookieHeader)
				return rootLoader(args)
			},
			children: [
				{
					path: '/stories/:storyId/chapter/:chapterId/',
					Component: CommentsRoute,
					loader: async (args) => {
						// add the cookie header to the request
						args.request.headers.set('cookie', cookieHeader)
						return loader(args)
					},
					action: async (args) => {
						// add the cookie header to the request
						args.request.headers.set('cookie', cookieHeader)
						args.request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
						return action(args)
					},
				},
			],
		},
	])

	const routeUrl = `/stories/${chapter.storyId}/chapter/${chapter.id}/`
	render(<App initialEntries={[routeUrl]} />)

	const commentInput = await screen.findByRole('textbox')
	const submitButton = await screen.findByRole('button', { name: /Comment/i })

	fireEvent.change(commentInput, { target: { value: 'This is a test comment' } })
	fireEvent.click(submitButton)

	await waitFor(() => {
		expect(screen.getByText('Posting...')).toBeInTheDocument()
	})

	const comment = await prisma.comment.findFirst({ select: { id: true, chapterId: true }, where: { content: 'This is a test comment' }})
	console.log(comment)
	expect(comment).not.toBeNull()
	expect(comment?.chapterId).toBe(chapter.id)

	await waitFor(() => {
		expect(screen.getByText('This is a test comment')).toBeInTheDocument()
	})
})

test('Displays error for empty comment submission', async () => {
	const user_info = await createUser()
	const user = await prisma.user.create({ data: user_info })
	const story = await createStory(prisma, { authorId: user.id })
	const chapter = await prisma.chapter.create({
		data: {
			title: 'Test Chapter',
			content: 'Test content',
			storyId: story.id,
			
		},
	})

	const App = createRemixStub([
		{
			path: '/stories/:storyId/chapter/:chapterId/comments',
			Component: CommentsRoute,
			loader,
			action,
		},
	])

	const routeUrl = `/stories/${chapter.storyId}/chapter/${chapter.id}/comments`
	render(<App initialEntries={[routeUrl]} />)

	const submitButton = await screen.findByRole('button', { name: /comment/i })

	fireEvent.click(submitButton)

	await waitFor(() => {
		expect(screen.getByText('Required')).toBeInTheDocument()
	})
})


