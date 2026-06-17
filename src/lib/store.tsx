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

interface Store {
  lang: Lang;
  setLang: (l: Lang) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  termOpen: boolean;
  setTermOpen: (v: boolean) => void;
  detailIdx: number | null;
  openDetail: (i: number) => void;
  closeDetail: () => void;
  cvOpen: boolean;
  setCvOpen: (v: boolean) => void;
  langFxKey: number;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

const ACCENT_MAP: Record<Accent, string> = {
  Lime: "#c7f536",
  Pink: "#ff2d8e",
  Violet: "#9d8dff",
};

function readStorage<T>(key: string, allowed: T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T;
    return allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");
  const [accent, setAccentState] = useState<Accent>("Lime");
  const [activeSection, setActiveSection] = useState<Section>("top");
  const [termOpen, setTermOpen] = useState(false);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [langFxKey, setLangFxKey] = useState(0);
  const [isAdmin, setAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(readStorage<Lang>("gq_lang", ["CAT", "ES", "EN"], "EN"));
    setAccentState(
      readStorage<Accent>("gq_accent", ["Lime", "Pink", "Violet"], "Lime")
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty(
      "--ac",
      ACCENT_MAP[accent]
    );
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

  const openDetail = useCallback((i: number) => setDetailIdx(i), []);
  const closeDetail = useCallback(() => setDetailIdx(null), []);

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
        accent,
        setAccent,
        activeSection,
        setActiveSection,
        termOpen,
        setTermOpen,
        detailIdx,
        openDetail,
        closeDetail,
        cvOpen,
        setCvOpen,
        langFxKey,
        isAdmin,
        setAdmin,
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
