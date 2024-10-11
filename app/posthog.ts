// app/posthog.js
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export default function PostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog('phc_sW1vsxNPZJJrH7PkpD9QTUMXIkENJebfXcPP9PGNyFQ', {
      host: 'https://eu.i.posthog.com',
    });
  }
  return posthogClient;
}