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
			<h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
			<Accordion type="single" collapsible className="w-full mb-4">
				<AccordionItem value="item-1">
					<AccordionTrigger>Platform for Writers</AccordionTrigger>
					<AccordionContent>
						We provide a user-friendly platform for writers to publish and share their work with a global audience.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Community</AccordionTrigger>
					<AccordionContent>
						Join our vibrant community of readers and fellow writers, where you can engage in discussions and receive valuable feedback.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<p className="mb-4">
				Join us in our journey to make the world a more connected and creative place, one story at a time.
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
