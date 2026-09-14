"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

export function PostHogIdentity() {
  const { isLoaded, user } = useUser();
  const previousUserId = useRef<string | null>(null);
  const userId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName ?? undefined;

  useEffect(() => {
    if (
      !isLoaded ||
      !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    if (userId) {
      if (previousUserId.current && previousUserId.current !== userId) {
        posthog.reset();
      }

      posthog.identify(userId, { email, name });
      previousUserId.current = userId;
    } else if (previousUserId.current) {
      posthog.reset();
      previousUserId.current = null;
    }
  }, [email, isLoaded, name, userId]);

  return null;
}
