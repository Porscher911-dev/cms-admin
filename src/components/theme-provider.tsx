"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  useEffect(() => {
    const applyBrandSettings = () => {
      const brandColor = localStorage.getItem("mrex_brand_color")
      if (brandColor) {
        document.documentElement.style.setProperty("--primary", brandColor)
      } else {
        document.documentElement.style.removeProperty("--primary")
      }
    }
    
    applyBrandSettings()
    window.addEventListener("storage", applyBrandSettings)
    window.addEventListener("themeSettingsUpdated", applyBrandSettings)
    
    return () => {
      window.removeEventListener("storage", applyBrandSettings)
      window.removeEventListener("themeSettingsUpdated", applyBrandSettings)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
