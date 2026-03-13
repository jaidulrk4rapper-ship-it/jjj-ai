// Client-safe helper — no server-only imports

/**
 * Get Pro plan status from user
 */
export function getProStatus(user: { proPlanExpiresAt?: string | null } | null) {
  if (!user?.proPlanExpiresAt) {
    return { isActive: false, daysLeft: 0, isExpiringSoon: false };
  }

  const now = new Date();
  const endsAt = new Date(user.proPlanExpiresAt);

  if (Number.isNaN(endsAt.getTime()) || endsAt <= now) {
    return { isActive: false, daysLeft: 0, isExpiringSoon: false };
  }

  const diffMs = endsAt.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = daysLeft <= 3;

  return { isActive: true, daysLeft, isExpiringSoon };
}
