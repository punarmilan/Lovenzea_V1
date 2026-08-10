import { PHOTO_BASE_URL } from '../services/api';

// ──────────────────────────────────────────────────────────────────────────────
//  normalizePhotoUrl
//
//  Converts any photo URL variant returned by the backend into the canonical
//  public MinIO URL served by Nginx:
//
//    https://api.lovenzea.online/minio/<objectPath>
//
//  Supported input formats
//  ───────────────────────
//  1.  https://api.lovenzea.online/minio/...          → returned unchanged
//  2.  http://localhost:9000/punarmilan-photos/...     → strips bucket prefix
//  3.  http://127.0.0.1:9000/punarmilan-photos/...    → strips bucket prefix
//  4.  http://minio:9000/punarmilan-photos/...        → strips bucket prefix
//  5.  https://lovenzea.online/api/photos/...         → maps to minio URL
//  6.  https://www.lovenzea.online/api/photos/...     → maps to minio URL
//  7.  /minio/...                                     → prepend base origin
//  8.  /api/photos/...                                → maps to minio URL
//  9.  /photos/...                                    → maps to minio URL
//  10. Plain object key / filename (no slash prefix)  → appends to minio base
//  11. Any other absolute http/https URL              → returned unchanged
//
//  Notes
//  ─────
//  • Query parameters (signed URL tokens) are preserved — no .split('?')[0].
//  • Individual path segments are not re-encoded here; the backend produces
//    correctly encoded object keys already.
//  • Returns null for empty / non-string input.
// ──────────────────────────────────────────────────────────────────────────────

export const normalizePhotoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const clean = url.trim();
  if (!clean) return null;

  // ── 1. Already the canonical public URL ─────────────────────────────────
  if (clean.startsWith('https://api.lovenzea.online/minio/')) {
    return clean;
  }

  // ── 2–4. Internal MinIO URLs — strip the bucket prefix ──────────────────
  const minioInternalPattern =
    /^https?:\/\/(?:localhost|127\.0\.0\.1|minio):9000\/(?:punarmilan|lovenzea)-photos\/(.*)/;
  const minioMatch = clean.match(minioInternalPattern);
  if (minioMatch) {
    const objectAndQuery = minioMatch[1]; // preserves query string
    return `${PHOTO_BASE_URL}/${objectAndQuery}`;
  }

  // ── 5–6. Old lovenzea.online/api/photos/ domain ─────────────────────────
  const oldDomainPattern =
    /^https?:\/\/(?:www\.)?lovenzea\.online\/api\/photos\/(.*)/;
  const oldDomainMatch = clean.match(oldDomainPattern);
  if (oldDomainMatch) {
    const objectAndQuery = oldDomainMatch[1];
    return `${PHOTO_BASE_URL}/${objectAndQuery}`;
  }

  // ── 7. Relative /minio/… ────────────────────────────────────────────────
  if (clean.startsWith('/minio/')) {
    return `https://api.lovenzea.online${clean}`;
  }

  // ── 8. Relative /api/photos/… ───────────────────────────────────────────
  if (clean.startsWith('/api/photos/')) {
    const objectAndQuery = clean.replace('/api/photos/', '');
    return `${PHOTO_BASE_URL}/${objectAndQuery}`;
  }

  // ── 9. Relative /photos/… ───────────────────────────────────────────────
  if (clean.startsWith('/photos/')) {
    const objectAndQuery = clean.replace('/photos/', '');
    return `${PHOTO_BASE_URL}/${objectAndQuery}`;
  }

  // ── 11. Any other absolute http/https URL (external avatars, etc.) ───────
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // ── 10. Plain MinIO object name / filename ───────────────────────────────
  return `${PHOTO_BASE_URL}/${clean}`;
};

// ──────────────────────────────────────────────────────────────────────────────
//  getFallbackAvatar
//
//  Returns a valid image URI for the given user object.
//
//  It checks these fields in priority order:
//    user.profilePhoto
//    user.profilePhotoUrl
//    user.photoUrl
//    user.otherProfilePhotoUrl
//    user.senderPhotoUrl
//    user.receiverPhotoUrl
//    user.userPhoto
//    user.photos?.[0]
//
//  If none resolve to a valid URL it generates a DiceBear "micah" avatar
//  seeded with the user's name, coloured by gender.
// ──────────────────────────────────────────────────────────────────────────────

export const getFallbackAvatar = (user) => {
  if (!user) {
    return 'https://api.dicebear.com/7.x/micah/png?seed=User&backgroundColor=ffdfbf';
  }

  // Check all known photo fields in priority order
  const rawPhoto =
    user.profilePhoto ||
    user.profilePhotoUrl ||
    user.photoUrl ||
    user.otherProfilePhotoUrl ||
    user.senderPhotoUrl ||
    user.receiverPhotoUrl ||
    user.userPhoto ||
    (Array.isArray(user.photos) && user.photos.length > 0
      ? typeof user.photos[0] === 'string'
        ? user.photos[0]
        : user.photos[0]?.uri
      : null);

  const normalized = normalizePhotoUrl(rawPhoto);
  if (normalized) return normalized;

  // Generate DiceBear fallback avatar
  const name = user.name || user.fullName || 'User';
  const isMale =
    user.gender && user.gender.toLowerCase() === 'male';
  const bgColor = isMale ? 'b6e3f4' : 'ffdfbf';

  return `https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(name)}&backgroundColor=${bgColor}&radius=50`;
};
