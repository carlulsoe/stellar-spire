import { invariant } from "@epic-web/invariant"
import { CONFIG } from "#app/config.ts"

export default function TermsOfServiceRoute() {
	invariant(CONFIG.SITENAME, "SITENAME is not set")
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
			<div className="space-y-4">
				<p>
					Welcome to the {CONFIG.SITENAME} platform, which is owned and operated by {CONFIG.COMPANY_NAME}, a private company incorporated in {CONFIG.COMPANY_COUNTRY}, company no. {CONFIG.COMPANY_NUMBER} (“{CONFIG.SITENAME}”, “we”, “us” or “our”), with registered place of business at {CONFIG.COMPANY_ADDRESS}.
				</p>
				<p>
					IMPORTANT INFORMATION: These Terms of Service, which include our Privacy Policy (the "Terms" or this “Agreement”, in short) constitute a binding agreement between us and you. By accessing our platform at: {CONFIG.SITENAME} (the “Platform”), creating an Account (as defined below) and using the Platform to post various content, including stories, comments and messages, or to access and view content (together, the “Services”), you signify your acceptance of these Terms.
				</p>
				<p>
				We may update these Terms at any time. We will notify you about such updates or changes by posting a notice on the Platform, and may send you a notice by e-mail. Your use of the Services following any amendment of these Terms will signify your assent to and acceptance of the revised Terms. If you do not agree to the Terms, your only remedy is to discontinue your use of the Services.
				</p>
				<p>
					Last updated: October 23rd, 2024.
				</p>

				<h2 className="text-2xl font-bold mt-4 mb-2">Minimum Age</h2>
				<p>
					If you want to use our Services you have to be at least thirteen (13) years old. If we learn that someone under the age of 13 is using the Services, we will terminate their Account.
				</p>
				<h2 className="text-2xl font-bold mt-4 mb-2">Your Account with Us</h2>
				<p>
					It is possible to read content created by other users without signing up to the Services. In order to use the full range of our Services, you need to create an account with us (“Account”). In addition to being of the minimum required age to use our Platform under applicable law, if you are not old enough to have authority to agree to our Terms in your country, your parent or guardian must agree to our Terms and our Privacy Policy on your behalf.
				</p>

				<h2 className="text-2xl font-bold mt-4 mb-2">Creating an Account</h2>
				<p>
				Only individual persons can register to the Platform. When registering on our Platform, you must provide accurate information about yourself. You may not use false information or impersonate another person or company through your Account. Your account is not transferable and so you may not transfer your Account to anyone else. It is your sole responsibility to ensure that the contact information in your Account is current and accurate. Changes to your contact information can be made through the Platform.
				You will be asked to choose a username for your profile. Do not choose a username that is in any way offensive, vulgar, or infringes someone's intellectual property rights.
				You are solely responsible for any activity on your Account, so it is important that you keep your Account password secure. You must not let anyone else access your Account or do anything else that might jeopardize the security of your Account. In the event you become aware of or reasonably suspect any breach of security, including, without limitation any loss, theft, or other unauthorized access to your Account, you must immediately notify us of such breach via our contact form at https://www.{CONFIG.DOMAIN}/contact. We will not be liable for your losses caused by any unauthorized use of your Account.
				We have no control over your actions or transactions made using the Platform. With that in mind, we will have no liability to you or to any third-party for any claims or damages that may arise as a result of any actions or transactions that you engage in while using the Platform.
				</p>
				<p>
				We reserve the right to deny your access to the Services immediately and with or without cause, including without limitation if we believe that you are in breach of these Terms for any reason whatsoever.
				</p>
				<h2 className="text-2xl font-bold mt-4 mb-2">Your Use of the Services</h2>
				<p>
				<h3>License.</h3> {CONFIG.SITENAME} hereby grants you, subject to the terms and conditions of these Terms, a non-exclusive, non-transferable personal license to:
				Use the Platform for your own personal use.
				</p>
				<h2 className="text-2xl font-bold mt-4 mb-2">Our Rights in the Services</h2>
				We reserve all rights in the Services' look and feel and in our content on the Services, including without limitation, all text, descriptions, products, software, graphics, all page headers, button icons, scripts, photos, videos, interactive features, and services ("Content") and the trademarks, service marks and logos contained therein ("Marks").
				You may not copy or adapt any portion of our Content or visual design elements (including Marks) without our prior express written permission or as set out in this clause. Please do not use our Marks in any way that might suggest {CONFIG.SITENAME} endorses a particular product or service, or that you have a business relationship with {CONFIG.SITENAME}.
				“{CONFIG.SITENAME}”, the {CONFIG.SITENAME} logo, and other Marks are trademarks of {CONFIG.SITENAME} or our affiliates' Marks. All other trademarks, service marks, and logos used on our Services are the trademarks, service marks, or logos of their respective owners.
				{CONFIG.SITENAME} may change, terminate, or restrict access to any aspect of the Services, at any time, without notice. We can remove any content you post or submit for any reason. {CONFIG.SITENAME} may access, read, preserve, and disclose any information as we reasonably believe is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request, (ii) enforce these Terms, including investigation of potential violations, (iii) detect, prevent, or otherwise address fraud, security or technical issues, (iv) cooperate with law enforcement authorities; (v) respond to user support requests, or (vi) protect the rights, property or safety of us, our users or the public.
				Content in the Platform or in the App is provided to you “AS IS” for your information and personal use only and may not be used, copied, distributed, transmitted, broadcast, displayed, sold, licensed, de-compiled, or otherwise exploited for any other purposes whatsoever without our prior written consent.
				You agree not to circumvent, disable or otherwise interfere with security-related features of the Services or features that prevent or restrict use or copying of any Content or that enforce limitations on use of the Services.
				Notices and Messages. We will provide notices and messages to you either via the services, or sent to the contact information you provided us when registering for the Platform, and you agree to ensure that this contact information is kept up to date from time to time.
				<h2 className="text-2xl font-bold mt-4 mb-2">Your Content</h2>
				Your Content belongs to you. Any content that you create and upload onto the Services is owned by you, and we refer to it as “ Your Content” in these Terms. You represent and warrant that you have all necessary rights to Your Content and that you are not infringing or violating any third party's rights by posting it.
				Rights You Grant {CONFIG.SITENAME}. By posting Your Content, you grant {CONFIG.SITENAME} a non-exclusive, worldwide, sub-licensable, revocable license to use, display, promote, edit, reformat, reproduce, publish, distribute, store, and sub-license Your Content on the Services. This allows us to provide the Services, and to promote Your Content or {CONFIG.SITENAME} in general, in any formats and through any channels, including any third-party website or advertising medium.

				You also grant {CONFIG.SITENAME} an irrevocable license to store and copy Your Content for the purposes of backups and internal testing of the services.
				Uploading Your Content. When uploading Your Content, you can choose the genre under which Your Content falls, and select tags applicable for Your Content, such as “Sci-Fi”, “Female Lead”, “Urban”, “Comedy” or many more as offered in the Services. You are also requested to include a content warning and identify whether Your Content contains sexual content, profanity, disturbing content or graphic violence.
				Infringing Content. {CONFIG.SITENAME} has great respect for intellectual property rights and is committed to following appropriate legal procedures to remove infringing content from the Platform. Whilst we can remove any content you post or submit for any reason, in any case if Your Content infringes another person's intellectual property, we will remove it if we receive proper notice, and will notify you if that occurs. You are responsible for Your Content and are liable for all risks related to its publication and display.
				Inappropriate or Prohibited Content. There are certain types of content we do not permit on our Services (for legal reasons or otherwise). We do not permit content that is categorized as erotica or that involves sexual activities involving underage characters. You further agree that you will not post, upload, send or otherwise transmit any content that is abusive, threatening, defamatory, contains hate speech, or is racially, ethnically or otherwise objectionable or offensive in any way or in violation of any other part of the Terms. You also may not post any content that constitutes a breach of any person's privacy or publicity rights, is false or misleading or uses the Services in a manner that is fraudulent or deceptive.
				Monitoring and Deletion. We have the right - but not the obligation - to monitor, censor, edit, modify, delete, and/or remove any and all content posted on the Services (including Your Content) at any time and for any reason. Without limiting the foregoing, we have the right - but not the obligation - to delete any content that we believe, in our sole discretion, does or may violate these Terms, our policies or any law.
				Storing of Removed Content. When we remove content from the Services, it may continue to be stored by us (though will not necessarily be stored), but we may not be able to retrieve the latest copy. Consequently, we encourage you to maintain your own backup of Your Content.
				Feedback. We encourage you to let us know your feedback, suggestions and ideas with respect to our Services, for example via https://www.{CONFIG.DOMAIN}/ideas. This can help us improve your experience and our Services. Any unsolicited ideas or other materials you submit to us (not including Your Content) are considered non-confidential and non-proprietary to you. You grant us a non-exclusive, worldwide, royalty-free, irrevocable, sub-licensable, perpetual license to use and publish those ideas and materials for any purpose, without compensation to you.
				{CONFIG.SITENAME} has the right to collect, use and store data concerning the usage and operation of the Platform and the Services collected in connection with the Account for any purpose provided that such data is anonymized and does not include information that identifies or provides a reasonable basis to identify a company or an individual.
				<h2 className="text-2xl font-bold mt-4 mb-2">Prohibited Activities</h2>
				You agree NOT to do any of the following when using the Services:
				take any action that infringes or violates other people's rights, violates any law, or breaches any contract or legal duty you have toward anyone.
				defame, stalk, bully, abuse, threaten, harass, abuse, intimidate, harm another person or engage in any other predatory behavior, including sending unwelcomed communications to others, or incite others to commit violent acts or any of the aforementioned;
				be disrespectful when you communicate or interact with others;
				share other users' or third party's information without their express written consent;
				utilize or copy information, content or any data you view on or obtain from the Services to provide any service that is competitive, in our sole discretion, with the Services;
				reverse engineer, decompile, disassemble, decipher or otherwise attempt to derive the source code for any underlying intellectual property used to provide the Services, or any part thereof;
				unless expressly permitted by us, use or launch any manual or automated system or software, devices, scripts robots, other means or processes to access, “scrape,” “crawl”, “cache”, “spider” any web page or other service contained in our Services, or to access the Services in a manner that sends more request messages to our servers in a given period of time than a human can reasonably produce in the same period by using a conventional on-line web browser;
				use 'bots' or other automated methods to access the Services, add or download contacts, send or redirect messages, or perform other similar activities through the Services;
				engage in “framing,” or in “mirroring,” or otherwise simulate the appearance or function of the Services in any way;
				attempt to or actually override any security component included in or underlying the Services; or
				interfere or disrupt the Services, including, but not limited to any servers or networks connected to the Services, or the underlying software.
				Breach of these Terms. Failure to comply with the rules above constitutes a serious and material breach of these Terms, and we may take all or any of the following actions (with or without notice):
				immediate, temporary or permanent withdrawal of your right to use our Services;
				immediate, temporary or permanent removal of any of Your Content;
				issuing of a warning to you;
				taking of legal action against you including proceedings for reimbursement of all costs (including, but not limited to, reasonable administrative and legal costs) resulting from the breach;
				disclosure of such information to law enforcement authorities as we reasonably feel is necessary, or otherwise may be obligated to disclose.
				investigate any suspected breach of the Terms. During such investigation we may temporarily withdraw your right to use our Services, pause your subscription, restrict right to use Services (including, without limitation, restrict the visibility of Your Content on our Platform, or pause or cancel your subscribers' subscriptions on Tebex or other third party providers), or remove Your Content without notice to you.

				The measures described herein are not exhaustive and we may take any other action we reasonably deem appropriate.
				<h2 className="text-2xl font-bold mt-4 mb-2">Copyright Issues</h2>
				{CONFIG.SITENAME} respects the copyrights of its users and any other person. If you believe that your copyrights are abused on the Services, please send us a written notification in accordance with the provisions specified at: https://www.{CONFIG.DOMAIN}/dmca. {CONFIG.SITENAME} will act in accordance with {CONFIG.SITENAME}'s DMCA Notice with regard to any content that is alleged to infringe the copyright of any third party.
				{CONFIG.SITENAME} may report any content and share user identifiable information, if {CONFIG.SITENAME} believes, in its sole discretion, that such content is illegal or abusive or may violate any third party rights.
				<h2 className="text-2xl font-bold mt-4 mb-2">Reporting Inappropriate and Objectionable Content</h2>

				If you find that specific content posted to the Services by another user, including a comment, is abusive, contains inappropriate or objectionable content or is otherwise in violation of these Terms, we strongly encourage you to immediately report such content to us [via our built-in reporting features or] by sending a support ticket https://www.{CONFIG.DOMAIN}/support. In your email, please state the reasons for your concern and provide a link to the content in question.

				Upon receiving such a report of a possible violation, we investigate the matter within a reasonable time following such report and take such action as we determine to be appropriate, including if we so determine, removing the inappropriate content and terminating access to the services for any the user who posted the objectionable content.
				<h2 className="text-2xl font-bold mt-4 mb-2">Service Fees</h2>

				{CONFIG.SITENAME} offers parts of its Services free of charge.
				{CONFIG.SITENAME} also offers fee-based plans for readers and authors. You may use them subject to purchasing one of the Service's plans, as listed in {CONFIG.SITENAME}'s website at: https://www.{CONFIG.DOMAIN}/premium/subscription. From time to time, we may change the Services fees, upon reasonable prior notice that we will post on the Services or send you by email.
				You may pay the fees by using the methods of payments as available, published and updated from time to time on the Services. We currently use PayPal as a third-party payment provider to process payments. PayPal is a third-party service provided by PayPal Holdings, Inc. and is subject to the PayPal User Agreement. If you are located in Israel, the relevant PayPal User Agreement can be found here; if you are located in the UK, the relevant PayPal User Agreement can be found here; if you are located in the USA, the relevant PayPal User Agreement can be found here, and if you are located elsewhere in the world the relevant PayPal User Agreement for such country or region will apply to your relationship with PayPal. If you use the App, you may also pay the fees via such payment method as stated in the App from time to time (for example the Google Play Store payment processor), in which case the fees may be converted into the currency used in your country. Fees will be regarded as paid only after your payment has been confirmed. The relevant features of the Services will be available to you promptly after you have paid the Service fees. You acknowledge that fees are not refundable.
				Payments will be required to include applicable taxes.
				{CONFIG.SITENAME} will use its reasonable commercial efforts to have a transaction processed accurately and expeditiously and reimburse you for any excess payment mistakenly charged. However, {CONFIG.SITENAME} will not be liable for mistakes, errors, malfunctions and miscalculations made by you, the payment service providers, or other third parties.
				Upon failure to make any payment or other material breach of these Terms, {CONFIG.SITENAME} may remove, disable or terminate the “Premium” feature of your Account. You waive any and all claims against {CONFIG.SITENAME} and anyone on {CONFIG.SITENAME}'s behalf in connection therewith.
				Support of Authors. Readers that are Account holders may support authors with regular or ad-hoc contributions. For the processing of such contributions we work with Tebex, a third party service provided by Tebex Limited. Tebex will apply their terms as may be enforceable by them from time to time to the processing of such payments. Authors may add a link to their Tebex account on their fiction page to give other users the option to support their work. As an author, you may decide to grant such supporters the right to advanced access to chapters published on the Services, or other rewards as deemed appropriate.
				<h2 className="text-2xl font-bold mt-4 mb-2">Third Parties' Links, Websites, and Services</h2>

				The Platform may contain links to third party websites, advertisers, services, special offers, or other events or activities that are not owned or controlled by us. It is important for you to note that we are not affiliated with those websites, that we have no control over those websites, and that we assume no responsibility for the content, privacy policies, or practices of any third-party websites. In addition, we will not and cannot censor or edit the content of any third-party site.

				If you access any third party's website, service, or content from our Services, you do so at your own risk. YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS. Accordingly, we encourage you to be aware when you have left the Services and to read the terms and conditions and privacy policy of each other website that you visit.
				<h2 className="text-2xl font-bold mt-4 mb-2">Disclaimer</h2>

				Each of the subsections below only applies up to the maximum extent permitted under applicable law. Some jurisdictions do not allow the disclaimer of implied warranties or the limitation of liability in contracts, and as a result the contents of this section may not apply to you in full or at all, in certain circumstances. Nothing in this section is intended to limit any rights you may have which may not be lawfully limited.

				No warranty. Your use of our Services and any content is solely at your own risk and discretion. They are provided to you "as is" and "as available". {CONFIG.SITENAME} specifically disclaims any implied warranty of merchantability, merchantable quality, fitness for a particular purpose, availability, security, title or non-infringement, and any warranties implied including as a result of any course of dealing or performance.

				Responsibility for Content. All content, whether publicly posted or privately transmitted, is the sole responsibility of the person who originated such content. We may not monitor or control the content posted via the Services and we cannot take responsibility for such content. We do not endorse, support, represent or guarantee the completeness, truthfulness, accuracy, or reliability of any content or communications posted via the Services or endorse any opinions expressed via the Services. You understand that by using the Services, you may be exposed to content that might be offensive, harmful, inaccurate or otherwise inappropriate, or in some cases, postings that have been mislabeled or are otherwise deceptive. Any material you download, view, or otherwise access through the Services is at your own risk. You will be solely responsible for any damage or loss of data that results from the download of any such material.

				Release. When you use the Services, you release {CONFIG.SITENAME} from claims, damages, and demands of every kind — known or unknown, suspected or unsuspected, disclosed or undisclosed — arising out of or in any way related to (a) disputes between users, or between users and any third party relating to the use of the Services and (b) the Services.

				EXCEPT AS EXPRESSLY STATED IN OUR PRIVACY POLICY WE, OUR AFFILIATES AND OUR AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, LICENSORS, ASSIGNS, AGENTS AND REPRESENTATIVES DO NOT MAKE ANY REPRESENTATIONS, WARRANTIES OR CONDITIONS OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE SECURITY OF ANY INFORMATION YOU MAY PROVIDE OR ACTIVITIES YOU ENGAGE IN DURING THE COURSE OF YOUR USE OF THE PLATFORM OR SERVICES.
				<h2 className="text-2xl font-bold mt-4 mb-2">LIMITATION OF LIABILITY</h2>
				{CONFIG.SITENAME.toUpperCase()} WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGE, COSTS, EXPENSES AND PAYMENTS OR FOR ANY LOSS OF PROFIT OR LOSS OF DATA, EITHER IN TORT (INCLUDING WITHOUT LIMITATION NEGLIGENCE), CONTRACT (INCLUDING AS A RESULT OF ANY PRE-CONTRACTUAL STATEMENTS), STRICT LIABILITY, STATUTORY LIABILITY OR IN ANY OTHER CAUSE OF ACTION, ARISING FROM, OR IN CONNECTION WITH THESE TERMS OR THE SERVICES, WHETHER OR NOT {CONFIG.SITENAME.toUpperCase()} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE, LOSS, COSTS, EXPENSES OR PAYMENTS.
				{CONFIG.SITENAME.toUpperCase()}'S AGGREGATE LIABILITY FOR ANY AND ALL CLAIMS OR CAUSES OF ACTION ARISING UNDER THESE TERMS OR IN CONNECTION WITH THE SERVICES, WHETHER ARISING OUT OF BREACH OF CONTRACT (INCLUDING AS A RESULT OF PRE-CONTRACTUAL STATEMENTS), TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, STATUTORY LIABILITY OR ANY OTHER CAUSE OF ACTION, SHALL NOT EXCEED THE TOTAL AMOUNT ACTUALLY RECEIVED BY {CONFIG.SITENAME.toUpperCase()} FROM YOU IN RESPECT OF THE SERVICES, DURING THE TWELVE (12) MONTHS BEFORE THE OCCURRENCE OF THE EVENTS GIVING RISE TO SUCH LIABILITY.
				NOTWITHSTANDING ANYTHING ELSE IN THESE TERMS, {CONFIG.SITENAME.toUpperCase()} WILL NOT EXCLUDE OR LIMIT ITS LIABILITY FOR DEATH OR PERSONAL INJURY RESULTING FROM ITS NEGLIGENCE; FRAUD OR FRAUDULENT MISREPRESENTATION; OR ANY OTHER LIABILITY WHICH MAY NOT BE LIMITED UNDER APPLICABLE LAW.
				<h2 className="text-2xl font-bold mt-4 mb-2">Indemnity</h2>

				You will indemnify, defend and hold harmless, {CONFIG.SITENAME} and {CONFIG.SITENAME}'s employees, directors, shareholders, advisors or anyone acting on {CONFIG.SITENAME}'s behalf with respect of any claim, demand, damage, loss, loss of profit, payment or expense, including reasonable attorney fees {CONFIG.SITENAME} or such persons may incur in connection with an alleged or actual breach of these Terms or an alleged or actual unlawful or tortuous action or inaction with respect to the Services by you or by anyone on your behalf.

				This defense, hold harmless and indemnification obligation will survive any termination of these Terms and your use of the Services.
				<h2 className="text-2xl font-bold mt-4 mb-2">Termination or Suspension of Your Account</h2>

				You may terminate your use of our Services at any time by deleting your Account. We reserve the right to terminate or suspend your Account or your access to the Services, as set forth hereinabove.
				<h2 className="text-2xl font-bold mt-4 mb-2">Governing Law and Jurisdiction</h2>

				These Terms shall be governed and construed by the laws of {CONFIG.COMPANY_COUNTRY}, without respect to its conflict of laws principles. You agree to submit to the personal and exclusive jurisdiction of the courts located in {CONFIG.COMPANY_COUNTRY}, and waive any jurisdictional, venue, or inconvenient forum objections to such courts.

				SOME JURISDICTIONS MAY NOT ALLOW OR LIMIT SOME OF THE PROVISIONS OF THESE TERMS, SO THAT SUCH PROVISIONS MAY NOT APPLY TO YOU.
				<h2 className="text-2xl font-bold mt-4 mb-2">Survival</h2>

				To the extent permitted by applicable law, all sections of these Terms which by their nature should survive termination will survive the termination of these Terms, including, without limitation Sections 3.2 (Our Rights in the Services), 4 (Your Content), 10 (Disclaimer), 11 (Limitation of Liability), 12 (Indemnity), 14 (Governing Law and Jurisdiction), 16 (General).
				<h2 className="text-2xl font-bold mt-4 mb-2">General</h2>

				These Terms along with the Privacy Policy and the DMCA Notice constitute the entire agreement between you and {CONFIG.SITENAME} with respect to the access and use of the Services and supersede any and all agreements, negotiations and understandings, whether written or oral, about the Services, except that if you have separately entered with {CONFIG.SITENAME} into an online or written agreement or subscription form that incorporates by reference these Terms, any terms of such agreement or subscription form that add to, conflict with or change these Terms shall prevail.

				If any provision of these Terms is deemed invalid by a court of competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of these Terms, which shall remain in full force and effect. No waiver, concession, extension, representation, alteration, addition or derogation from these Terms will be effective unless affected in writing and signed by the party whose waiver is made.

				You may not assign your rights and obligations under these Terms without {CONFIG.SITENAME}'s prior written consent and any assignment without such prior written consent will be void. {CONFIG.SITENAME} may freely assign its rights and obligations herein. Subject to any provisions herein with regard to assignment, all covenants and agreements herein shall bind and inure to the benefit of the respective heirs, executors, administrators, successors and assigns of the parties hereto.

			</div>
		</div>
	)
}
