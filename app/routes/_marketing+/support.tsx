import { invariant } from "@epic-web/invariant"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#app/components/ui/accordion.js"
import { CONFIG } from "#app/config.ts"

export default function SupportRoute() {
	invariant(CONFIG.DOMAIN, "DOMAIN is not set")
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">Support</h1>
			<p className="mb-4">
				Welcome to our support page. We're here to help you with any questions or issues you may have.
			</p>
			<h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
			<p className="mb-4">
				For assistance, please email us at <a href={`mailto:support@${CONFIG.DOMAIN}`} className="text-blue-600 hover:underline">support@{CONFIG.DOMAIN}</a>.
			</p>
			<h2 className="text-2xl font-semibold mb-2">FAQs</h2>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger>How do I create an account?</AccordionTrigger>
					<AccordionContent>
						To create an account, click on the "Sign Up" button in the top right corner of the page and follow the prompts.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>How can I upload a story?</AccordionTrigger>
					<AccordionContent>
						After logging in, navigate to your dashboard and click on the "Upload Story" button. Follow the instructions to upload your story file.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>What file formats are supported?</AccordionTrigger>
					<AccordionContent>
						We currently support .txt, .doc, .docx, and .pdf file formats for story uploads.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger>How do I change my account settings?</AccordionTrigger>
					<AccordionContent>
						Go to your account profile page and click on the "Settings" tab. From there, you can update your personal information, change your password, and manage your preferences.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
