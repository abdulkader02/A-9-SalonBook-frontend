export { cn } from "cn"

/**
 * Returns a safe internal path for post-authentication redirects.
 *
 * Only relative paths starting with a single "/" are accepted so a
 * `callbackUrl` can never point at an external host (no protocol, no
 * protocol-relative "//host" paths). Anything else returns null and the
 * caller falls back to its default redirect.
 */
export const getSafeCallbackUrl = (value?: string | null) => {
  if (!value) return null
  if (!value.startsWith("/")) return null
  if (value.startsWith("//") || value.startsWith("/\\")) return null

  return value
}
