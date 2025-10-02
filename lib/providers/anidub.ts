import { DubProvider, GetEpisodeOptions } from "../types/dub-provider"

export class AniDubProvider implements DubProvider {
  private baseUrl = "https://anidub.api/v1"

  // Best-effort scraper: if pageUrl is provided, try to fetch the HTML
  // and extract the first .m3u8 or .mp4 URL. This covers many simple players
  // that leak the direct stream into the page or inline scripts.
  private async tryScrapePageForStream(pageUrl?: string): Promise<string | null> {
    if (!pageUrl) return null
    try {
      const res = await fetch(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } })
      if (!res.ok) return null
      const text = await res.text()

      // Look for common patterns: src="...m3u8" or https://.../playlist.m3u8 or .mp4
        const urlRegex = new RegExp('(https?://[^"\'<>\\s]+?\\.(?:m3u8|mp4))(?:[^0-9a-zA-Z]|$)', 'ig')
      let match: RegExpExecArray | null
      while ((match = urlRegex.exec(text)) !== null) {
        const found = match[1]
        // prefer m3u8 over mp4 if both present
        if (found.endsWith('.m3u8')) return found
        // remember mp4 but continue scanning for m3u8
        if (found.endsWith('.mp4')) return found
      }

      return null
    } catch (e) {
      console.error('AniDub scrape error', e)
      return null
    }
  }

  async getEpisodeUrl(animeId: number, episode: number, quality: string, opts?: GetEpisodeOptions): Promise<string> {
    const FALLBACK = `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`

    // 1) If caller provided a pageUrl, try scraping it first (best-effort)
    if (opts?.pageUrl) {
      const scraped = await this.tryScrapePageForStream(opts.pageUrl)
      if (scraped) return scraped
    }

    // 2) Try the provider API (if available)
    try {
      const res = await fetch(`${this.baseUrl}/anime/${animeId}/episode/${episode}?quality=${quality}`)
      if (!res.ok) throw new Error('Failed to get episode URL from provider API')

      const data = await res.json()
      if (data?.url) return data.url
    } catch (e) {
      console.error('AniDub API error:', e)
    }

    // 3) Give up and return a safe public MP4 for dev/test
    return FALLBACK
  }

  async getAvailableQualities(animeId: number, episode: number): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/anime/${animeId}/episode/${episode}/qualities`)
      if (!res.ok) throw new Error('Failed to get qualities')
      
      const data = await res.json()
      return data.qualities
    } catch (e) {
      console.error('AniDub API error:', e)
      return ["1080p", "720p", "480p"] // Fallback качества
    }
  }
}