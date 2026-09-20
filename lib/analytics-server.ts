/**
 * Server-side PostHog event capture utility.
 * Sends events via PostHog HTTP API without exposing server secrets to the client.
 */

export interface ServerEventPayload {
  event: string;
  distinctId?: string;
  properties?: Record<string, unknown>;
}

export async function captureServerEvent({
  event,
  distinctId = "anonymous_server_user",
  properties = {},
}: ServerEventPayload): Promise<void> {
  const token =
    process.env.POSTHOG_API_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host =
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com";

  if (!token) return;

  const normalizedHost = host.replace(/\/$/, "");
  const url = `${normalizedHost}/capture/`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: token,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: "ai-lms-server",
        },
        timestamp: new Date().toISOString(),
      }),
      // Fire-and-forget timeout so request latency is unaffected
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      throw new Error(
        `PostHog server capture failed with HTTP status ${res.status} ${res.statusText}`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PostHog Server Analytics] Failed to capture "${event}":`, error);
    }
  }
}
