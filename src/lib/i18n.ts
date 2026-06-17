import type { Lang } from "@/types/content";

// Maps our 3-letter lang code to the IETF locale next-intl expects
export const LOCALE_MAP: Record<Lang, string> = {
  CAT: "ca",
  ES:  "es",
  EN:  "en",
};

export function toLocale(lang: Lang): string {
  return LOCALE_MAP[lang];
}
