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
