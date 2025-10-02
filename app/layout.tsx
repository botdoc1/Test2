import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/hooks/use-auth"
// dev-only service worker unregister helper (client component)
import UnregisterSW from "@/components/dev/unregister-sw"
import "./globals.css"

export const metadata: Metadata = {
  title: "AnimeHub - Смотри аниме онлайн",
  description: "Современный портал для просмотра аниме с удобным поиском, плеером и личным кабинетом",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          {/* Unregister service workers in development to avoid stale offline states */}
          {process.env.NODE_ENV === "development" && <UnregisterSW />}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
