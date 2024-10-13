import { HttpResponse, http, type HttpHandler } from 'msw'
import { requireHeader } from './utils.ts'

const { json } = HttpResponse

export const handlers: Array<HttpHandler> = [
	http.post(`https://eu.i.posthog.com/batch`, async ({ request }) => {
		requireHeader(request.headers, 'Authorization')
		const body = await request.json()
		console.info('🔶 mocked posthog batch capture:', body)

		return json({
			success: true,
		})
	}),
]
