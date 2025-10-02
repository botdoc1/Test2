export interface AnimeSource {
  url: string
  quality: string
}

export interface GetEpisodeOptions {
  pageUrl?: string
  headers?: Record<string, string>
}

export interface DubProvider {
  // opts is optional and may include a pageUrl to scrape, or extra headers
  getEpisodeUrl(animeId: number, episode: number, quality: string, opts?: GetEpisodeOptions): Promise<string>
  getAvailableQualities(animeId: number, episode: number): Promise<string[]>
}