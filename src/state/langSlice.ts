import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LangFile } from "api/LangFile";
import Local from "Local";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

interface LangSlice {
  packName: string;
  removalPrefix: string;
  /**
   * Maps namespaces to their original lang files.
   */
  files: Record<string, LangFile>;
  /**
   * Maps namespaces to langcodes. Each langcode contains keys and values, that
   * will override keys and values in the original file.
   */
  overrides: Record<string, Record<string, LangFile>>;
  /**
   * Maps namespaces to arrays of strings. An array of strings defines all the
   * keys in the original lang file that are to be disabled.
   */
  removals: Record<string, string[]>;
}

export type LangDoc = LangSlice;

const initialState: LangSlice = {
  packName: Local.loadLangPackName() ?? "Lang overrides",
  removalPrefix: Local.loadLangRemovalPrefix() ?? "[REMOVED] ",
  files: Local.loadLangFiles() ?? {},
  overrides: Local.loadLangOverrides() ?? {},
  removals: Local.loadLangRemovals() ?? {},
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

    setPackName (state, action: PayloadAction<string>) {
      const packName = action.payload;

      state.packName = packName;
    },

    setRemovalPrefix (state, action: PayloadAction<string>) {
      const removalPrefix = action.payload;

      state.removalPrefix = removalPrefix;
    },

    addLangFile (state, action: PayloadAction<{
      namespace: string;
      file: LangFile;
    }>) {
      const { namespace, file } = action.payload;

      state.files[namespace] = file;

      if (!state.overrides[namespace]) {
        state.overrides[namespace] = { en_us: {} };
      }
      if (!state.removals[namespace]) {
        state.removals[namespace] = [];
      }
    },

    updateLangFile (state, action: PayloadAction<{
      namespace: string;
      file: LangFile;
    }>) {
      const { namespace, file } = action.payload;
      if (state.files[namespace] === undefined) return;

      state.files[namespace] = file;
    },

    override (state, action: PayloadAction<{
      namespace: string;
      langCode: string;
      key: string;
      value: string;
    }>) {
      const { namespace, langCode, key, value } = action.payload;

      if (value === "") {
        delete state.overrides[namespace][langCode][key];
      }
      else {
        state.overrides[namespace][langCode][key] = value;
      }
    },

    addOverrideLangcode (state, action: PayloadAction<{
      namespace: string;
      langCode: string;
    }>) {
      const { namespace, langCode } = action.payload;

      state.overrides[namespace][langCode] = {};
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
