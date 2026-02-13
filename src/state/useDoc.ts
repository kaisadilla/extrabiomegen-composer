import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function useDoc () {
  const doc = useSelector((state: RootState) => state.doc);

  return {
    ...doc,
  };
}
