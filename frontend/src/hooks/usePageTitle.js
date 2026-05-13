import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ARIT` : "ARIT";
    return () => {
      document.title = "ARIT";
    };
  }, [title]);
}