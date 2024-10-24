import fs from 'node:fs'
import { faker } from '@faker-js/faker'
import { Prisma, type PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { UniqueEnforcer } from 'enforce-unique'

const uniqueUsernameEnforcer = new UniqueEnforcer()

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.userName({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

export function createPassword(password: string = faker.internet.password()) {
	return {
		hash: bcrypt.hashSync(password, 10),
	}
}

let storyImages: Array<Awaited<ReturnType<typeof img>>> | undefined
export async function getStoryImages() {
	if (storyImages) return storyImages

	storyImages = await Promise.all([
		img({
			altText: 'a nice country house',
			filepath: './tests/fixtures/images/stories/0.png',
		}),
		img({
			altText: 'a city scape',
			filepath: './tests/fixtures/images/stories/1.png',
		}),
		img({
			altText: 'a sunrise',
			filepath: './tests/fixtures/images/stories/2.png',
		}),
		img({
			altText: 'a group of friends',
			filepath: './tests/fixtures/images/stories/3.png',
		}),
		img({
			altText: 'friends being inclusive of someone who looks lonely',
			filepath: './tests/fixtures/images/stories/4.png',
		}),
		img({
			altText: 'an illustration of a hot air balloon',
			filepath: './tests/fixtures/images/stories/5.png',
		}),
		img({
			altText:
				'an office full of laptops and other office equipment that look like it was abandoned in a rush out of the building in an emergency years ago.',
			filepath: './tests/fixtures/images/stories/6.png',
		}),
		img({
			altText: 'a rusty lock',
			filepath: './tests/fixtures/images/stories/7.png',
		}),
		img({
			altText: 'something very happy in nature',
			filepath: './tests/fixtures/images/stories/8.png',
		}),
		img({
			altText: `someone at the end of a cry session who's starting to feel a little better.`,
			filepath: './tests/fixtures/images/stories/9.png',
		}),
	])

	return storyImages
}

let userImages: Array<Awaited<ReturnType<typeof img>>> | undefined
export async function getUserImages() {
	if (userImages) return userImages

	userImages = await Promise.all(
		Array.from({ length: 10 }, (_, index) =>
			img({ filepath: `./tests/fixtures/images/user/${index}.jpg` }),
		),
	)

	return userImages
}

export async function img({
	altText,
	filepath,
}: {
	altText?: string
	filepath: string
}) {
	return {
		altText,
		contentType: filepath.endsWith('.png') ? 'image/png' : 'image/jpeg',
		blob: await fs.promises.readFile(filepath),
	}
}

export async function cleanupDb(prisma: PrismaClient) {
	const tables = await prisma.$queryRaw<
		{ name: string }[]
	>`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`

	try {
		// Disable FK constraints to avoid relation conflicts during deletion
		await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`)
		await prisma.$transaction(tables.map(({ name }) =>
				prisma.$executeRawUnsafe(`DELETE from "${name}"`),
			))
	} catch (error) {
		console.error('Error cleaning up database:', error)
	} finally {
		await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`)
	}
}

export async function createComment(prisma: PrismaClient, { chapterId, authorId }: { chapterId: string; authorId: string }) {
	const comment = await prisma.comment.create({
		data: {
			content: faker.lorem.paragraph(),
			score: faker.number.int({ min: 0, max: 100 }),
			chapter: { connect: { id: chapterId } },
			author: { connect: { id: authorId } },
			parentId: undefined,
		},
	})
	return comment
}

export async function createStory(prisma: PrismaClient, { authorId }: { authorId: string }) {
	const story = await prisma.story.create({
		data: {
			title: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
			authorId,
			coverImage: undefined,
		},
	})
	return story
}