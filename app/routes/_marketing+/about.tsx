import { Link } from "@remix-run/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#app/components/ui/accordion.js"
import { Button } from "#app/components/ui/button.tsx"
import { useOptionalUser } from "#app/utils/user.ts"

export default function AboutRoute() {
	const user = useOptionalUser()

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">About Us</h1>
			<p className="mb-4">
				Welcome to our platform. We are dedicated to providing a space for writers to share their stories and connect with readers around the world.
			</p>
			<h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
			<p className="mb-4">
				Our mission is to empower writers and inspire readers through the power of storytelling. We believe that everyone has a story to tell, and we're here to help those stories reach a wider audience.
			</p>
			{user ? (
				<Button size="lg" asChild>
					<Link to="/post">Post Story</Link>
				</Button>
			) : (
				<Button size="lg" asChild>
					<Link to="/signup">Sign Up</Link>
				</Button>
			)}
		</div>
	)
}
