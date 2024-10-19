import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { requireUserId } from '#app/utils/auth.server.ts'
import { StoryEditor } from '../../users+/$username_+/__story-editor.tsx'

export { action } from '../../users+/$username_+/__story-editor.server.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	return json({})
}

export default StoryEditor
