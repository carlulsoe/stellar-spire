import { type MetaFunction } from '@remix-run/node'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'

export const meta: MetaFunction = () => [{ title: 'Stellar Ink' }]

export default function Index() {
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="container mx-auto px-4">
				<h2 className="text-2xl font-bold mb-4">Recommended Stories</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{/* This is a placeholder. You'd typically map over actual story data here */}
					{[1, 2, 3, 4].map((story) => (
						<Card key={story} className="shadow-md rounded-lg p-4 w-[350px]">
							<CardHeader>
								<CardTitle>Story Title {story}</CardTitle>
								<CardDescription>Author Name</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm mb-4">A brief preview of the story... Et dolor ut delenit accumsan dolor at ut voluptua. Rebum clita dolore clita eos dolore invidunt eu ipsum et justo. Zzril no hendrerit eirmod diam magna autem no consectetuer aliquyam illum clita aliquyam. Eirmod aliquip diam elitr vel lorem diam. </p>
							</CardContent>
							<CardFooter>
								<a href="#" className="text-blue-500 hover:underline">Read more</a>
							</CardFooter>
						</Card>
					))}
			</div>
			</div>
		</main>
	)
}
