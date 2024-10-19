import type { ActionFunctionArgs, AppLoadContext, EntryContext, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { RemixServer } from '@remix-run/react'
import * as Sentry from '@sentry/remix'
import chalk from 'chalk'
import { isbot } from 'isbot'
import { renderToReadableStream } from "react-dom/server";
import { getEnv, init } from './utils/env.server.ts'
import { NonceProvider } from './utils/nonce-provider.ts'
import { makeTimings } from './utils/timing.server.ts'

const ABORT_DELAY = 5000

init()
global.ENV = getEnv()

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	loadContext: AppLoadContext
  ) {

	if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
		responseHeaders.append('Document-Policy', 'js-profiling')
	}

	const nonce = loadContext.cspNonce?.toString() ?? ''
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);
	const body = await renderToReadableStream(
		<NonceProvider value={nonce}>
			<RemixServer
				context={remixContext}
				url={request.url}
				abortDelay={ABORT_DELAY}
			/>
		</NonceProvider>,
		{
		  signal: controller.signal,
		  onError(error: unknown) {
			if (!controller.signal.aborted) {
			  // Log streaming rendering errors from inside the shell
			  console.error(error);
			}
			responseStatusCode = 500;
		  },
		}
	  );
	
	  body.allReady.then(() => clearTimeout(timeoutId));
	
	  if (isbot(request.headers.get("user-agent") || "")) {
		await body.allReady;
	  }
	
	  responseHeaders.set("Content-Type", "text/html");
	  return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	  });
}


export function handleError(
	error: unknown,
	{ request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
	// Skip capturing if the request is aborted as Remix docs suggest
	// Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
	if (request.signal.aborted) {
		return
	}
	if (error instanceof Error) {
		console.error(chalk.red(error.stack))
		void Sentry.captureRemixServerException(
			error,
			'remix.server',
			request,
			true,
		)
	} else {
		console.error(error)
		Sentry.captureException(error)
	}
}
