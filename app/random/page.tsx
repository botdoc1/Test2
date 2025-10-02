import { redirect } from "next/navigation"

async function fetchRandomMalId(retries = 5) {
  const maxPages = 1000
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const page = Math.floor(Math.random() * maxPages) + 1
      const url = `https://api.jikan.moe/v4/anime?page=${page}&limit=1`
      const res = await fetch(url)
      if (!res.ok) {
        // If rate limited or server error, wait a bit and retry
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)))
        continue
      }
      const data = await res.json()
      const item = data?.data?.[0]
      if (item && item.mal_id) return item.mal_id
    } catch (e) {
      // network error — backoff and retry
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)))
    }
  }
  return null
}

export default async function RandomPage() {
  const malId = await fetchRandomMalId()
  if (malId) {
    redirect(`/anime/${malId}`)
  }

  // Fallback UI rendered server-side if we couldn't pick random anime
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Не удалось выбрать случайное аниме</h1>
        <p className="text-muted-foreground mb-6">Попробуйте открыть страницу позже или перейти в каталог.</p>
        <div className="flex justify-center">
          <a href="/catalog" className="btn">
            Перейти в каталог
          </a>
        </div>
      </div>
    </div>
  )
}
