import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LangFile } from "api/LangFile";
import Local from "Local";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

interface LangSlice {
  /**
   * Maps namespaces to their original lang files.
   */
  files: Record<string, LangFile>;
  /**
   * Maps namespaces to modified lang files. These lang files may be empty or
   * contain only some values.
   */
  overrides: Record<string, LangFile>;
  /**
   * Maps namespaces to arrays of strings. An array of strings defines all the
   * keys in the original lang file that are to be disabled.
   */
  removals: Record<string, string[]>;
  removalPrefix: string;
}

export type LangDoc = LangSlice;

const initialState: LangSlice = {
  files: Local.loadLangFiles() ?? {},
  overrides: Local.loadLangOverrides() ?? {},
  removals: Local.loadLangRemovals() ?? {},
  removalPrefix: "[REMOVED] ",
}

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    loadDoc (state, action: PayloadAction<LangDoc>) {
      const { files, overrides, removals, removalPrefix } = action.payload;

      state.files = files;
      state.overrides = overrides;
      state.removals = removals;
      state.removalPrefix = removalPrefix;
    },

    addLangFile (state, action: PayloadAction<{
      namespace: string;
      file: LangFile;
    }>) {
      const { namespace, file } = action.payload;

      state.files[namespace] = file;

      if (!state.overrides[namespace]) {
        state.overrides[namespace] = {};
      }
      if (!state.removals[namespace]) {
        state.removals[namespace] = [];
      }
    },

    override (state, action: PayloadAction<{
      namespace: string;
      key: string;
      value: string;
    }>) {
      const { namespace, key, value } = action.payload;

      if (value === "") {
        delete state.overrides[namespace][key];
      }
      else {
        state.overrides[namespace][key] = value;
      }
    },

    setEnabled (state, action: PayloadAction<{
      namespace: string;
      key: string;
      enabled: boolean;
    }>) {
      const { namespace, key, enabled } = action.payload;

      const arr = state.removals[namespace];

      if (enabled) {
        state.removals[namespace] = arr.filter(k => k !== key);
      }
      else if (arr.includes(key) === false) {
        arr.push(key);
      }
    }
  },
});

export const langReducer = langSlice.reducer;
export const LangActions = langSlice.actions;

export default function useLang () {
  const lang = useSelector((state: RootState) => state.lang);

  return {
    ...lang,
  }
}
