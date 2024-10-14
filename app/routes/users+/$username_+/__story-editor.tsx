import {
	FormProvider,
	getFieldsetProps,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
	type FieldMetadata,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type Story, type StoryImage } from '@prisma/client'
import { type SerializeFrom } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { CardContent, CardHeader, CardTitle , Card } from '#app/components/ui/card.js'
import { Icon } from '#app/components/ui/icon.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { cn, getStoryImgSrc, useIsPending } from '#app/utils/misc.tsx'
import { type action } from './__story-editor.server'


const titleMinLength = 1
const titleMaxLength = 100
const contentMinLength = 1
const contentMaxLength = 10000

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
})

export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>

export const StoryEditorSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	description: z.string().min(contentMinLength).max(contentMaxLength),
	coverImage: ImageFieldsetSchema.optional(),
})

export function StoryEditor({
	story,
}: {
	story?: SerializeFrom<
		Pick<Story, 'id' | 'title' | 'description'> & {
			coverImage?: Pick<StoryImage, 'id' | 'altText'>
		}
	>
}) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'story-editor',
		constraint: getZodConstraint(StoryEditorSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: StoryEditorSchema })
		},
		defaultValue: {
			...story,
			coverImage: story?.coverImage ?? { id: '', altText: null },
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="container mx-auto py-10">
		<Card className="w-full max-w-2xl mx-auto">
		  <CardHeader>
			<CardTitle className="text-3xl font-bold text-center">Create Your Story</CardTitle>
		  </CardHeader>
		  <CardContent>
			<FormProvider context={form.context}>
				<Form
					method="POST"
					className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-5"
					{...getFormProps(form)}
					encType="multipart/form-data"
				>
					{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
					<button type="submit" className="hidden" />
					{story ? <input type="hidden" name="id" value={story.id} /> : null}
					<div className="flex flex-col gap-1">
						<Field
							labelProps={{ children: 'Title' }}
							inputProps={{
								autoFocus: true,
								...getInputProps(fields.title, { type: 'text' }),
							}}
							errors={fields.title.errors}
							placeholder="Enter your story title"
						/>
						<TextareaField
							labelProps={{ children: 'Description' }}
							textareaProps={{
								...getTextareaProps(fields.description),
							}}
							errors={fields.description.errors}
							className="mb-4"
							placeholder="Write a brief description of your story"
						/>
						<div>
							<Label>Cover Image</Label>
							<div className="relative">
								{fields.coverImage && (
									<ImageChooser meta={fields.coverImage as FieldMetadata<ImageFieldset>} />
								)}
							</div>
						</div>
					</div>
					<ErrorList id={form.errorId} errors={form.errors} />
				</Form>
				<div className="flex justify-between">
					<Button variant="destructive" {...form.reset.getButtonProps()}>
						Reset
					</Button>
					<StatusButton
						form={form.id}
						type="submit"
						disabled={isPending}
						status={isPending ? 'pending' : 'idle'}
					>
						Submit
					</StatusButton>
				</div>
			</FormProvider>
			</CardContent>
			</Card>
		</div>
	)
}

function ImageChooser({ meta }: { meta: FieldMetadata<ImageFieldset> }) {
	const fields = meta.getFieldset()
	const existingImage = Boolean(fields.id.initialValue)
	const [previewImage, setPreviewImage] = useState<string | null>(
		fields.id.initialValue ? getStoryImgSrc(fields.id.initialValue) : null,
	)
	const [altText, setAltText] = useState(fields.altText.initialValue ?? '')

	return (
		<fieldset {...getFieldsetProps(meta)}>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							htmlFor={fields.file.id}
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-2': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									<img
										src={previewImage}
										alt={altText ?? ''}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									<Icon name="plus" />
								</div>
							)}
							{existingImage ? (
								<input {...getInputProps(fields.id, { type: 'hidden' })} />
							) : null}
							<input
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={(event) => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								accept="image/*"
								{...getInputProps(fields.file, { type: 'file' })}
							/>
						</label>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>
				<div className="flex-1">
					<Label htmlFor={fields.altText.id}>Alt Text</Label>
					<Textarea
						onChange={(e) => setAltText(e.currentTarget.value)}
						{...getTextareaProps(fields.altText)}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				<ErrorList id={meta.errorId} errors={meta.errors} />
			</div>
		</fieldset>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No story with the id "{params.storyId}" exists</p>
				),
			}}
		/>
	)
}
