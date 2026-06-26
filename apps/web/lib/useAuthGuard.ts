"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./auth-store";

/**
 * Redirects to /login when the auth store has initialized and no user is present.
 * Call this at the top of any protected page component.
 */
export function useAuthGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loadMe = useAuthStore((s) => s.loadMe);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  return { user, initialized };
}
