import { type MetaFunction } from '@remix-run/node'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip.tsx'
import { cn } from '#app/utils/misc.tsx'
import { logos } from './logos/logos.ts'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

// Tailwind Grid cell classes lookup
const columnClasses: Record<(typeof logos)[number]['column'], string> = {
	1: 'xl:col-start-1',
	2: 'xl:col-start-2',
	3: 'xl:col-start-3',
	4: 'xl:col-start-4',
	5: 'xl:col-start-5',
}
const rowClasses: Record<(typeof logos)[number]['row'], string> = {
	1: 'xl:row-start-1',
	2: 'xl:row-start-2',
	3: 'xl:row-start-3',
	4: 'xl:row-start-4',
	5: 'xl:row-start-5',
	6: 'xl:row-start-6',
}

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
