import { type MetaFunction } from '@remix-run/react'
import { type loader as storiesLoader } from './stories.tsx'

export default function StoriesIndexRoute() {
	return (
		<div className="container pt-12">
			<p className="text-body-md">Select a story</p>
		</div>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/users+/$username_+/stories': typeof storiesLoader }
> = ({ params, matches }) => {
	const storiesMatch = matches.find(
		(m) => m.id === 'routes/users+/$username_+/stories',
	)
	const displayName = storiesMatch?.data?.author.name ?? params.username
	const storyCount = storiesMatch?.data?.author.stories.length ?? 0
	const storiesText = storyCount === 1 ? 'story' : 'stories'
	return [
		{ title: `${displayName}'s Stories | Stellar Stories` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${storyCount} ${storiesText} on Stellar Stories`,
		},
	]
}