import fs from 'node:fs'
import { faker } from '@faker-js/faker'
import { type StoryImage, type Story } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'

test('Users can create story with an image', async ({ page, login }) => {
	const user = await login()
	await page.goto(`/users/${user.username}/stories`)

	const newStory = createStory()
	const altText = 'cute koala'
	await page.getByRole('link', { name: 'new story' }).click()

	// fill in form and submit
	await page.getByRole('textbox', { name: 'title' }).fill(newStory.title)
	await page.getByRole('textbox', { name: 'description' }).fill(newStory.description)
	await page
		.getByLabel('image')
		.nth(0)
		.setInputFiles('tests/fixtures/images/kody-notes/cute-koala.png')
	await page.getByRole('textbox', { name: 'alt text' }).fill(altText)

	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(new RegExp(`/users/${user.username}/stories/.*`))
	await expect(page.getByRole('heading', { name: newStory.title })).toBeVisible()
	await expect(page.getByAltText(altText)).toBeVisible()
})

test('Users can create story with multiple images', async ({ page, login }) => {
	const user = await login()
	await page.goto(`/users/${user.username}/stories`)

	const newStory = createStory()
	const altText1 = 'cute koala'
	const altText2 = 'koala coder'
	await page.getByRole('link', { name: 'new story' }).click()

	// fill in form and submit
	await page.getByRole('textbox', { name: 'title' }).fill(newStory.title)
	await page.getByRole('textbox', { name: 'description' }).fill(newStory.description)
	await page
		.getByLabel('image')
		.nth(0)
		.setInputFiles('tests/fixtures/images/kody-notes/cute-koala.png')
	await page.getByLabel('alt text').nth(0).fill(altText1)
	await page.getByRole('button', { name: 'add image' }).click()

	await page
		.getByLabel('image')
		.nth(1)
		.setInputFiles('tests/fixtures/images/kody-notes/koala-coder.png')
	await page.getByLabel('alt text').nth(1).fill(altText2)

	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(new RegExp(`/users/${user.username}/stories/.*`))
	await expect(page.getByRole('heading', { name: newStory.title })).toBeVisible()
	await expect(page.getByAltText(altText1)).toBeVisible()
	await expect(page.getByAltText(altText2)).toBeVisible()
})

test('Users can edit story image', async ({ page, login }) => {
	const user = await login()

	const story = await prisma.story.create({
		select: { id: true },
		data: {
			...createStoryWithImage(),
			authorId: user.id,
		},
	})
	await page.goto(`/users/${user.username}/stories/${story.id}`)

	// edit the image
	await page.getByRole('link', { name: 'Edit', exact: true }).click()
	const updatedImage = {
		altText: 'koala coder',
		location: 'tests/fixtures/images/kody-notes/koala-coder.png',
	}
	await page.getByLabel('image').nth(0).setInputFiles(updatedImage.location)
	await page.getByLabel('alt text').nth(0).fill(updatedImage.altText)
	await page.getByRole('button', { name: 'submit' }).click()

	await expect(page).toHaveURL(`/users/${user.username}/stories/${story.id}`)
	await expect(page.getByAltText(updatedImage.altText)).toBeVisible()
})

test('Users can delete story image', async ({ page, login }) => {
	const user = await login()

	const story = await prisma.story.create({
		select: { id: true, title: true },
		data: {
			...createStoryWithImage(),
			authorId: user.id,
		},
	})
	await page.goto(`/users/${user.username}/stories/${story.id}`)

	await expect(page.getByRole('heading', { name: story.title })).toBeVisible()
	// find image tags
	const images = page
		.getByRole('main')
		.getByRole('list')
		.getByRole('listitem')
		.getByRole('img')
	const countBefore = await images.count()
	await page.getByRole('link', { name: 'Edit', exact: true }).click()
	await page.getByRole('button', { name: 'remove image' }).click()
	await page.getByRole('button', { name: 'submit' }).click()
	await expect(page).toHaveURL(`/users/${user.username}/stories/${story.id}`)
	const countAfter = await images.count()
	expect(countAfter).toEqual(countBefore - 1)
})

function createStory() {
	return {
		title: faker.lorem.words(3),
		description: faker.lorem.paragraphs(3),
	} satisfies Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'authorId' | 'likesCount'>
}
function createStoryWithImage() {
	return {
		...createStory(),
		images: {
			create: {
				altText: 'cute koala',
				contentType: 'image/png',
				blob: fs.readFileSync(
					'tests/fixtures/images/kody-notes/cute-koala.png',
				),
			},
		},
	} satisfies Omit<
		Story,
		'id' | 'createdAt' | 'updatedAt' | 'type' | 'authorId' | 'likesCount'
	> & {
		images: { create: Pick<StoryImage, 'altText' | 'blob' | 'contentType'> }
	}
}
