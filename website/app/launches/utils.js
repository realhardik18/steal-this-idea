/**
 * Determines if we're on the launches subdomain.
 * On the subdomain, links should be relative (e.g. "/" instead of "/launches",
 * "/3" instead of "/launches/3").
 */
export function useIsSubdomain() {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("launches.");
}

/**
 * Returns the correct path depending on whether we're on the subdomain or main domain.
 * On subdomain: "/launches" → "/", "/launches/3" → "/3"
 * On main domain: paths stay as-is
 */
export function useLaunchPath(path) {
  const isSub = useIsSubdomain();
  if (!isSub) return path;
  // Strip /launches prefix for subdomain
  if (path === "/launches") return "/";
  if (path.startsWith("/launches/")) return path.replace("/launches", "");
  return path;
}
