import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { requireUserId } from '#app/utils/auth.server.ts'
import { ChapterEditor } from './__chapter-editor.tsx'

export { action } from './__chapter-editor.server.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export default ChapterEditor
