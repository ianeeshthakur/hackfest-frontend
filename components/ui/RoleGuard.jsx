"use client";

/**
 * RoleGuard
 *
 * Wraps page content. If the active role does not match `allowedRole`,
 * the user is immediately redirected to their home route.
 *
 * Usage:
 *   <RoleGuard allowedRole="owner">  — only factory owner can see this
 *   <RoleGuard allowedRole="buyer">  — only buyer can see this
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole, getHomeRoute } from "@/lib/roleContext";

export function RoleGuard({ children, allowedRole }) {
  const { role } = useRole();
  const router = useRouter();

  const allowed = role === allowedRole;

  useEffect(() => {
    if (!allowed) {
      router.replace(getHomeRoute(role));
    }
  }, [allowed, role, router]);

  if (!allowed) {
    // Render nothing while redirect is happening
    return null;
  }

  return <>{children}</>;
}
