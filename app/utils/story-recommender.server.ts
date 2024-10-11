import { invariantResponse } from '@epic-web/invariant'
import { prisma } from '#app/utils/db.server.ts'

export async function getRecommendedStories(userId: string, take: number) {
	invariantResponse(userId, 'User ID is required', { status: 400 })
	const userWithInteractions = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			storyInteractions: {
				where: { type: { in: ['like', 'rate'] } },
				include: { story: true },
			},
			similaritiesAsUser2: {
				orderBy: { similarity: 'desc' },
				take: 10,
				include: {
					user1: {
						include: {
							storyInteractions: {
								where: { type: { in: ['like', 'rate'] } },
								include: { story: true },
							},
						},
					},
				},
			},
		},
	})

	invariantResponse(userWithInteractions, 'User not found', { status: 404 })

	// Calculate recommendations based on similar users' interactions
	const recommendedStoryIds = new Set<string>()
	const userInteractedStoryIds = new Set(
		userWithInteractions.storyInteractions.map((i) => i.story.id),
	)

	for (const similarity of userWithInteractions.similaritiesAsUser2) {
		for (const interaction of similarity.user1.storyInteractions) {
			if (!userInteractedStoryIds.has(interaction.story.id)) {
				recommendedStoryIds.add(interaction.story.id)
			}
			if (recommendedStoryIds.size >= take) break
		}
		if (recommendedStoryIds.size >= take) break
	}

	// Fetch full details of recommended stories
	return await prisma.story.findMany({
		where: { id: { in: Array.from(recommendedStoryIds) } },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					name: true,
					username: true,
				},
			},
		},
		take: take,
	})
}