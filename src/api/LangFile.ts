import { DEFAULT_LANGCODE } from "Const";
import type { LangDoc } from "state/langSlice";
import z from "zod";

export type LangFile = Record<string, string>;

export function parseLangFile (json: string) : LangFile | null {
  let obj: unknown;

  try {
    obj = JSON.parse(json);
  }
  catch (err) {
    console.error("JSON parsing failed", err);
    return null;
  }

  if (typeof obj !== 'object' || obj === null) return null;

  if (Object.values(obj).some(v => typeof v !== "string")) {
    return null;
  }

  return obj as LangFile;
}

export const LangFileSchema: z.ZodType<LangFile> =
  z.record(z.string(), z.string());

export function generateLangFile (
  doc: LangDoc, ns: string, langcode: string
) : LangFile | null {
  const overrides = doc.overrides[ns][langcode];
  const defOverrides = doc.overrides[ns][DEFAULT_LANGCODE];
  const removals = doc.removals[ns];

  if (!overrides && !removals) return null;

  const file: LangFile = {};

  for (const k of Object.keys(defOverrides)) {
    file[k] = defOverrides[k];
  }
  for (const k of Object.keys(overrides)) {
    file[k] = overrides[k];
  }
  for (const k of removals) {
    file[k] = doc.removalPrefix + k;
  }

  if (Object.keys(file).length === 0) return null;

  return file;
}

export function generateLangPackFileName (packName: string) {
  return packName
    .replaceAll("'s", "")
    .replaceAll(" ", "-")
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
}
