"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteFocus() {
  const pathname = usePathname();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#main h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.dataset.routeHeading = "true";
        heading.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
