import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { RoleProvider } from "@/components/providers/role-provider";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Quản trị Mrex Agency",
  description: "Hệ thống quản trị doanh nghiệp Mrex Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TranslationProvider>
            <RoleProvider>
              {children}
              <Toaster position="top-center" />
            </RoleProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
