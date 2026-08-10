import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * The app shell scrolls inside `main`, not `window`, so React Router's own
 * scroll restoration (which targets window) never fires. This resets the
 * named scroll container to the top on every route change instead.
 */
export function ScrollToTopOnNavigate({ containerId }: { containerId: string }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (el) el.scrollTop = 0;
  }, [pathname, containerId]);

  return null;
}
