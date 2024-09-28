import { GeneralErrorBoundary } from "#app/components/error-boundary.js"


export default function ChapterRoute() {
	return <div>Chapter</div>
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No chapter with the id "{params.chapterId}" exists</p>
				),
			}}
		/>
	)
}