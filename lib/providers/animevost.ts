import { DubProvider, GetEpisodeOptions } from "../types/dub-provider"

export class AnimeVostProvider implements DubProvider {
  private baseUrl = "https://animevost.api/v1"

  async getEpisodeUrl(animeId: number, episode: number, quality: string, _opts?: GetEpisodeOptions): Promise<string> {
    const FALLBACK = `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
    try {
      const res = await fetch(`${this.baseUrl}/play/${animeId}/${episode}?quality=${quality}`)
      if (!res.ok) throw new Error('Failed to get episode URL')
      
      const data = await res.json()
      return data.url
    } catch (e) {
      console.error('AnimeVost API error:', e)
      return FALLBACK
    }
  }

  async getAvailableQualities(animeId: number, episode: number): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/play/${animeId}/${episode}/qualities`)
      if (!res.ok) throw new Error('Failed to get qualities')
      
      const data = await res.json()
      return data.qualities
    } catch (e) {
      console.error('AnimeVost API error:', e)
      return ["1080p", "720p", "480p"] // Fallback качества
    }
  }
}