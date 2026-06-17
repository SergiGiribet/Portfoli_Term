import rawContent from "../../content.json";
import type { Content, Lang, Project, CvData, Bio } from "@/types/content";

export const content = rawContent as Content;

export function getBio(lang: Lang): Bio {
  return content.bio[lang];
}

export function getContact(lang: Lang): string {
  return content.contact[lang];
}

export function getCv(lang: Lang): CvData {
  return content.cv[lang];
}

export function getProjects(lang: Lang): (Project & { descL: string; longL: string })[] {
  return content.projects.map((p) => ({
    ...p,
    descL: p.desc[lang],
    longL: p.long[lang],
  }));
}
