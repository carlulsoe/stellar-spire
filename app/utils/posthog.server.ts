import PostHogClient from "../posthog";

export function capturePosthogEvent(request: Request, eventName: string) {
    const cookieString = request.headers.get('Cookie') || '';  
    const projectAPIKey = process.env.POSTHOG_API_KEY;
    const cookieName = `ph_${projectAPIKey}_posthog`;
    const cookieMatch = cookieString.match(new RegExp(cookieName + '=([^;]+)'));
    let distinctId;
  
    if (cookieMatch) {
      const parsedValue = JSON.parse(decodeURIComponent(cookieMatch[1] || ''));
      if (parsedValue && typeof parsedValue === 'object' && 'distinct_id' in parsedValue) {
        distinctId = parsedValue.distinct_id;
      } else {
        distinctId = crypto.randomUUID();
      }
    } else {
      distinctId = crypto.randomUUID();
    }
  
    const phClient = PostHogClient();
    phClient.capture({
      distinctId: distinctId as string,
      event: eventName
    });
  
    return distinctId;
}