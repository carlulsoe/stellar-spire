import { invariant } from '@epic-web/invariant'
import { type Story, type Chapter } from '@prisma/client'
import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers'
import computeCosineSimilarity from 'compute-cosine-similarity'
import { prisma } from '#app/utils/db.server.ts'

type Vector = number[]

let embeddingPipeline: FeatureExtractionPipeline

async function initializeModel() {
	embeddingPipeline = await pipeline(
		'feature-extraction',
		'Xenova/bge-large-en-v1.5',
	)
	console.log('BAAI/bge-large-en-v1.5 model loaded')
}

export async function embedContent(content: string): Promise<Vector> {
	const result = await embeddingPipeline(content, {
		pooling: 'mean',
		normalize: true,
	})
	return Array.from(result.data)
}

export async function updateStoryEmbedding(story: Story) {
	invariant(story.id, 'Story ID is required')
	const chapters: Chapter[] = await prisma.chapter.findMany({
		where: { storyId: story.id },
	})
	const embedding = await embedContent(chapters.map((c) => c.content).join(' '))
	await prisma.story.update({
		where: { id: story.id },
		data: {
			embedding: JSON.stringify(embedding),
		},
	})
}

async function getStoryPopularity(storyId: string): Promise<number> {
	const readCount = await prisma.userReadHistory.count({
		where: { storyId },
	})
	return readCount / 100 // Normalize to a 0-1 scale. Adjust as needed.
}

export async function getRecommendedStories(
	userId: string,
	k: number = 10,
): Promise<Story[]> {
	invariant(userId, 'userId is required')
	const userHistory = await prisma.userReadHistory.findMany({
		where: { userId },
		include: { story: true },
		orderBy: { readTime: 'desc' },
	})

	const currentTime = new Date()
	let weightedSum: number[] = Array(1024).fill(0) // bge-large-en-v1.5 produces 1024-dimensional embeddings
	let weightSum = 0

	for (const historyEntry of userHistory) {
		const timeDiff =
			(currentTime.getTime() - historyEntry.readTime.getTime()) /
			(1000 * 60 * 60 * 24)
		const weight = Math.exp(-timeDiff / 30)
		if (historyEntry.story.embedding) {
			const embedding = JSON.parse(historyEntry.story.embedding) as Vector
			weightedSum = weightedSum.map(
				(val, i) => val + weight * (embedding[i] ?? 0),
			)
			weightSum += weight
		} else {
			console.warn(`Story ${historyEntry.storyId} has no embedding`)
		}
	}

	const userProfile = weightedSum.map((val) => val / weightSum)

	const allStories = await prisma.story.findMany()

	const similarities = new Map<string, number>()
	for (const story of allStories) {
		if (!userHistory.some((h) => h.storyId === story.id) && story.embedding) {
			const simScore =
				computeCosineSimilarity(
					userProfile,
					JSON.parse(story.embedding) as Vector,
				) ?? 0
			const popularityScore = await getStoryPopularity(story.id)
			const combinedScore = 0.7 * simScore + 0.3 * popularityScore
			similarities.set(story.id, combinedScore)
		}
	}

	const recommendations = Array.from(similarities.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, k)

	const diverseRecommendations = await addDiversity(
		recommendations,
		allStories,
		k,
	)

	// Fetch and return the full Story objects
	return prisma.story.findMany({
		where: {
			id: {
				in: diverseRecommendations.map((rec) => rec[0]),
			},
		},
	})
}

async function addDiversity(
	recommendations: [string, number][],
	stories: Story[],
	k: number,
): Promise<[string, number][]> {
	invariant(
		recommendations.length > 0,
		'Recommendations array must contain at least one element',
	)
	invariant(
		stories.length > 0,
		'Stories array must contain at least one element',
	)
	invariant(k > 0, 'k must be greater than 0')
	invariant(recommendations[0], 'First recommendation must exist')
	const diverseRecs: [string, number][] = recommendations[0]
		? [recommendations[0]]
		: []
	const storyMap = new Map(stories.map((s) => [s.id, s]))

	for (let i = 1; i < k; i++) {
		let maxMinDistance = 0
		let nextRec: [string, number] | null = null
		for (const rec of recommendations) {
			if (!diverseRecs.some((r) => r[0] === rec[0])) {
				const minDistance = Math.min(
					...diverseRecs.map((r) =>
						computeCosineSimilarity(
							JSON.parse(storyMap.get(rec[0])!.embedding ?? '[]') as Vector,
							JSON.parse(storyMap.get(r[0])!.embedding ?? '[]') as Vector,
						) ?? 0,
					),
				)
				if (minDistance > maxMinDistance) {
					maxMinDistance = minDistance
					nextRec = rec
				}
			}
		}
		if (nextRec) {
			diverseRecs.push(nextRec)
		}
	}
	return diverseRecs
}

export async function recordUserRead(userId: string, storyId: string) {
	await prisma.userReadHistory.create({
		data: {
			userId,
			storyId,
			readTime: new Date(),
		},
	})
}

// Embedding model initialization
export async function startEmbeddingModel() {
	await initializeModel() // Load the model at startup
}
