"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import en from "../i18n/en.json"
import vi from "../i18n/vi.json"

type Locale = "en" | "vi"

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const translations = { en, vi }

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi")

  // On mount, check if there's a saved preference
  useEffect(() => {
    const saved = localStorage.getItem("app-locale") as Locale
    if (saved && (saved === "en" || saved === "vi")) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("app-locale", newLocale)
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".")
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value === undefined) break
      value = value[k]
    }

    if (typeof value !== "string") {
      // Fallback to key if not found so that string methods like .replace() don't crash
      return key as any
    }

    // Replace params (e.g. {hours})
    if (params) {
      let interpolated = value
      Object.keys(params).forEach(p => {
        interpolated = interpolated.replace(`{${p}}`, String(params[p]))
      })
      return interpolated
    }

    return value
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
