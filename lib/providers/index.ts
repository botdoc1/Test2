import { AniDubProvider } from "./anidub"
import { AnimeVostProvider } from "./animevost"
import type { DubProvider } from "../types/dub-provider"
import { providers as mockProviders } from "./mock"

// Normalize provider keys to lowercase to avoid case mismatches between
// frontend values and registered providers.
let providers: Record<string, DubProvider>

if (process.env.NODE_ENV === 'development') {
  // In development use mock providers (no external network calls).
  providers = mockProviders as Record<string, DubProvider>
} else {
  providers = {
    anidub: new AniDubProvider(),
    animevost: new AnimeVostProvider(),
  }
}

export function getDubProvider(name: string): DubProvider | null {
  if (!name) return null
  return providers[name.toLowerCase()] || null
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers)
}