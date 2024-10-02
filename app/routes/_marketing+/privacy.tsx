import { invariant } from "@epic-web/invariant"
import { CONFIG } from "#app/config.ts"

export default function PrivacyRoute() {
	invariant(CONFIG.DOMAIN, "DOMAIN is not set")
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
			<div className="space-y-4">
				<section>
					<h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
					<p>This Privacy Policy explains how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of {CONFIG.SITENAME}.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
					<p>We collect information you provide directly to us, such as when you create or modify your account, request customer support, or communicate with us. This information may include: name, email address, postal address, phone number, and other information you choose to provide.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
					<p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our platform and our users. We also use this information to offer you tailored content and to send you notifications, updates, and promotional materials.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">4. Sharing and Disclosure</h2>
					<p>We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We may also share information when we believe it's necessary to comply with the law, to protect our rights and safety, or to protect the rights and safety of others.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
					<p>We retain your information for as long as your account is active or as needed to provide you services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
					<p>Under the GDPR, you have the right to access, rectify, port, and erase your data. You also have the right to object to and restrict certain processing of your data. This includes the right to object to our processing of your data for direct marketing and the right to withdraw your consent at any time when we process your data based on your consent.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">7. International Data Transfers</h2>
					<p>Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">8. Changes to This Privacy Policy</h2>
					<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
					<p>If you have any questions about this Privacy Policy, please contact us at support@{CONFIG.DOMAIN}.</p>
				</section>
			</div>
		</div>
	)
}
