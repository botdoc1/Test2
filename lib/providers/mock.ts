import { DubProvider } from "../types/dub-provider"

class MockProvider implements DubProvider {
  constructor(private prefix: string) {}

  async getEpisodeUrl(animeId: number, episode: number, quality: string, _opts?: any): Promise<string> {
    // Возвращаем публичный тестовый MP4, чтобы плеер мог воспроизводить его в браузере
    // (используем один стабильный публичный файл для разработки)
    return `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  }

  async getAvailableQualities(animeId: number, episode: number): Promise<string[]> {
    // Простая логика: все эпизоды имеют три качества
    return ["1080p", "720p", "480p"]
  }
}

// Временная реализация для тестирования
export const providers: Record<string, DubProvider> = {
  "anidub": new MockProvider("api.anidub.com"),
  "animevost": new MockProvider("api.animevost.org")
}

export function getDubProvider(name: string): DubProvider | null {
  return providers[name] || null
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers)
}