import { remember } from '@epic-web/remember'
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

export const prisma = remember('prisma', () => {
	// NOTE: if you change anything in this function you'll need to restart
	// the dev server to see your changes.

	// Feel free to change this log threshold to something that makes sense for you
	const logThreshold = 20

	const client = new PrismaClient({
		log: [
			{ level: 'query', emit: 'event' },
			{ level: 'error', emit: 'stdout' },
			{ level: 'warn', emit: 'stdout' },
		],
	})
	client.$on('query', async (e) => {
		if (e.duration < logThreshold) return
		const color =
			e.duration < logThreshold * 1.1
				? 'green'
				: e.duration < logThreshold * 1.2
					? 'blue'
					: e.duration < logThreshold * 1.3
						? 'yellow'
						: e.duration < logThreshold * 1.4
							? 'redBright'
							: 'red'
		const dur = chalk[color](`${e.duration}ms`)
		console.info(`prisma:query - ${dur} - ${e.query}`)
	})
	client.$extends({
		name: 'updateStoryLikes',
		query: {
		  chapter: {
			async create({ args, query }) {
			  const result = await query(args)
			  if (result.storyId) {
				await updateStoryTotalLikes(result.storyId)
			  }
			  return result
			},
			async update({ args, query }) {
			  const result = await query(args)
			  if (result.storyId) {
				await updateStoryTotalLikes(result.storyId)
			  }
			  return result
			},
			async delete({ args, query }) {
			  const chapter = await prisma.chapter.findUnique({
				where: args.where,
				select: { storyId: true }
			  })
			  const result = await query(args)
			  if (chapter?.storyId) {
				await updateStoryTotalLikes(chapter.storyId)
			  }
			  return result
			},
		  },
		},
	  })

	void client.$connect()
	return client
})

async function updateStoryTotalLikes(storyId: string) {
	const chapters = await prisma.chapter.findMany({
	  where: { storyId },
	  select: { likes: true }
	})
	
	const likesCount = chapters.reduce((sum, chapter) => sum + chapter.likes.length, 0)
	
	await prisma.story.update({
	  where: { id: storyId },
	  data: { likesCount }	
	})
  }