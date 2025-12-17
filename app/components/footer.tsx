import React from "react";
import { useLocation } from "react-router";

export default function Footer() {
  const location = useLocation();
  const [initialLoad, setInitialLoad] = React.useState<string | null>(null);
  const [loadTime, setLoadTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (nav) {
      setInitialLoad((nav.loadEventEnd / 1000).toFixed(2));
    }
  }, []);

  React.useEffect(() => {
    const start = performance.now();

    requestAnimationFrame(() => {
      const duration = performance.now() - start;
      setLoadTime((duration / 1000).toFixed(2));
    });
  }, [location.key]);

  return (
    <div id="footer">
      <p>
        v{__COMMIT_HASH__ ?? "Development"} - DottoXD @{" "}
        {new Date().getFullYear()} - init {initialLoad}s | route {loadTime}s
      </p>
    </div>
  );
}
