"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Lang } from "@/types/content";

type Accent = "Lime" | "Pink" | "Violet";
type Section = "top" | "profile" | "work" | "contact";

interface SiteSettings {
  display_name: string; slogan: string;
  sub_name: string; coords: string; year: string;
  contact_cat: string; contact_es: string; contact_en: string;
  status_text: string;
}

interface SelectedProject {
  id: string; no: string; org: string; cjk: string; kind: string;
  img: string; href: string; tags: string[]; role: string; year: string;
  name: string; long_cat: string; long_es: string; long_en: string;
}

interface Store {
  lang: Lang;
  setLang: (l: Lang) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  termOpen: boolean;
  setTermOpen: (v: boolean) => void;
  detailProject: SelectedProject | null;
  openDetail: (p: SelectedProject) => void;
  closeDetail: () => void;
  cvOpen: boolean;
  setCvOpen: (v: boolean) => void;
  langFxKey: number;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  siteSettings: SiteSettings;
}

const Ctx = createContext<Store | null>(null);

const ACCENT_MAP: Record<Accent, string> = {
  Lime: "#c7f536",
  Pink: "#ff2d8e",
  Violet: "#9d8dff",
};

const DEFAULT_SETTINGS: SiteSettings = {
  display_name: "GIRQUELL",
  slogan: "BORN TO USE. MADE TO CREATE.",
  sub_name: "SERGI GIRIBET",
  coords: "41.97°N / 2.78°E",
  year: "2026",
  contact_cat: "Tens una idea, un projecte o ganes de construir? Parlem-ne.",
  contact_es: "¿Tienes una idea, un proyecto o ganas de construir? Hablemos.",
  contact_en: "Got an idea, a project or the itch to build? Let's talk.",
  status_text: "EN PAUSA",
};

function readStorageOptional<T>(key: string, allowed: T[]): T | null {
  try {
    const v = localStorage.getItem(key) as T;
    return allowed.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");
  const [accent, setAccentState] = useState<Accent>("Lime");
  const [activeSection, setActiveSection] = useState<Section>("top");
  const [termOpen, setTermOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<SelectedProject | null>(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [langFxKey, setLangFxKey] = useState(0);
  const [isAdmin, setAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedLang   = readStorageOptional<Lang>("gq_lang",   ["CAT", "ES", "EN"]);
    const storedAccent = readStorageOptional<Accent>("gq_accent", ["Lime", "Pink", "Violet"]);

    fetch("/api/settings")
      .then(r => r.json())
      .then((d: Partial<SiteSettings> & { default_lang?: string; accent?: string } | null) => {
        const dbLang   = (["CAT","ES","EN"] as string[]).includes(d?.default_lang ?? "") ? d!.default_lang as Lang : "EN";
        const dbAccent = (["Lime","Pink","Violet"] as string[]).includes(d?.accent ?? "") ? d!.accent as Accent : "Lime";
        setLangState(storedLang   ?? dbLang);
        setAccentState(storedAccent ?? dbAccent);
        if (d) {
          setSiteSettings(s => ({
            display_name: d.display_name ?? s.display_name,
            slogan:       d.slogan       ?? s.slogan,
            sub_name:     d.sub_name     ?? s.sub_name,
            coords:       d.coords       ?? s.coords,
            year:         d.year         ?? s.year,
            contact_cat:  d.contact_cat  ?? s.contact_cat,
            contact_es:   d.contact_es   ?? s.contact_es,
            contact_en:   d.contact_en   ?? s.contact_en,
            status_text:  d.status_text  ?? s.status_text,
          }));
        }
      })
      .catch(() => {
        setLangState(storedLang   ?? "EN");
        setAccentState(storedAccent ?? "Lime");
      });

    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setAdmin(true); })
      .catch(() => {});

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--ac", ACCENT_MAP[accent]);
  }, [accent, mounted]);

  const setLang = useCallback((l: Lang) => {
    try { localStorage.setItem("gq_lang", l); } catch {}
    setLangFxKey((k) => k + 1);
    setLangState(l);
  }, []);

  const setAccent = useCallback((a: Accent) => {
    try { localStorage.setItem("gq_accent", a); } catch {}
    setAccentState(a);
  }, []);

  const openDetail  = useCallback((p: SelectedProject) => setDetailProject(p), []);
  const closeDetail = useCallback(() => setDetailProject(null), []);

  return (
    <Ctx.Provider
      value={{
        lang, setLang, accent, setAccent,
        activeSection, setActiveSection,
        termOpen, setTermOpen,
        detailProject, openDetail, closeDetail,
        cvOpen, setCvOpen,
        langFxKey, isAdmin, setAdmin,
        siteSettings,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
