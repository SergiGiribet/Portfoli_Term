"use client";

import { NextIntlClientProvider } from "next-intl";
import { useStore } from "@/lib/store";
import { toLocale } from "@/lib/i18n";

// Message bundles imported statically so no async fetch is needed
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import ca from "../../../messages/ca.json";

const MESSAGES = { en, es, ca } as Record<string, object>;

export default function IntlProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useStore();
  const locale = toLocale(lang);

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
