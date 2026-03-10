import { getPageTitle } from "App";
import { useEffect } from "react";

export function usePageTitle (title: string) {
  useEffect(() => {
    document.title = getPageTitle(title);
  }, [title]);
}
