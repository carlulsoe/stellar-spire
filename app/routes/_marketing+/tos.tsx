import { invariant } from "@epic-web/invariant"
import { CONFIG } from "#app/config.ts"

export default function TermsOfServiceRoute() {
	invariant(CONFIG.SITENAME, "SITENAME is not set")
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
			<div className="space-y-4">
				<section>
					<h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
					<p>By accessing or using our {CONFIG.SITENAME} platform, you agree to be bound by these Terms of Service.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
					<p>You must create an account to use certain features of our platform. You are responsible for maintaining the confidentiality of your account information.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">3. Content Submission</h2>
					<p>By submitting content to our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
					<p>You retain all rights to your original content. You must not upload content that infringes on the intellectual property rights of others.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">5. Prohibited Content</h2>
					<p>Content that is illegal, abusive, or violates our community guidelines is strictly prohibited.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">6. Termination</h2>
					<p>We reserve the right to terminate or suspend your account at our discretion, without prior notice, for violations of these terms.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
					<p>Our platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our services.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
					<p>We may modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the new terms.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
					<p>These terms are governed by and construed in accordance with the laws of Denmark.</p>
				</section>
			</div>
		</div>
	)
}
