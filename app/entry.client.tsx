import { RemixBrowser } from '@remix-run/react'
import posthog from "posthog-js";
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

function PosthogInit() {
	posthog.init('phc_sW1vsxNPZJJrH7PkpD9QTUMXIkENJebfXcPP9PGNyFQ', {
		api_host: 'https://eu.i.posthog.com',
		person_profiles: 'identified_only',
	});
	return null;
}

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	void import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>
	);
});

if (window.requestIdleCallback) {
	window.requestIdleCallback(PosthogInit);
} else {
	window.setTimeout(PosthogInit, 1);
}