/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor , fireEvent } from '@testing-library/react'
import setCookieParser from 'set-cookie-parser'
import { expect, test } from 'vitest'
import { loader as rootLoader } from '#app/root.tsx'
import { getSessionExpirationDate, sessionKey } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { createUser, getUserImages, createComment, createStory } from '#tests/db-utils.ts'
import { loader , action } from './$chapterId_.index.comments.server.tsx'

import { default as CommentsRoute } from './$chapterId_.index.comments.tsx'



test('loader returns comments', async () => {
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

  const response = await loader({ request: new Request('http://localhost:3000/stories/1/chapter/1/comments'), context: {}, params: { storyId: story.id, chapterId: chapter.id } })
  expect(response.status).toBe(200)
  const data = await response.json()
  expect(data.comments.length).toBe(1)
  expect(data.comments[0]?.content).toBe(comment.content)
  expect(data.comments[0]?.author.username).toBe(user.username)
})

test('action saves comments', async () => {
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

  const formData = new URLSearchParams()
  formData.set('content', 'Test comment')

  const response = await action({
    request: new Request(`http://localhost/stories/${story.id}/chapter/${chapter.id}/comments`, {
      method: 'POST',
      headers: {
        cookie: cookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    }),
    context: {},
    params: { storyId: story.id, chapterId: chapter.id }
  })
  expect(response.status).toBe(302)
  expect(response.headers.get('Location')).toBe(`/stories/${story.id}/chapter/${chapter.id}/`)
  const comments = await prisma.comment.findMany({ where: { chapterId: chapter.id } })
  expect(comments.length).toBe(1)
  expect(comments[0]?.content).toBe('Test comment')
  expect(comments[0]?.authorId).toBe(user.id)
})