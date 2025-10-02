import { type NextRequest, NextResponse } from "next/server"

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoff = 300): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        // Throw to trigger retry for 5xx errors, do not retry on 4xx
        if (res.status >= 500 && i < retries) {
          await new Promise((r) => setTimeout(r, backoff * (i + 1)))
          continue
        }
        const text = await res.text().catch(() => "")
        const err: any = new Error(`Request failed with status ${res.status}`)
        err.status = res.status
        err.body = text
        throw err
      }
      return res
    } catch (err) {
      if (i === retries) throw err
      await new Promise((r) => setTimeout(r, backoff * (i + 1)))
    }
  }
  throw new Error("Failed to fetch after retries")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const genre = searchParams.get("genre")
  const year = searchParams.get("year")
  const status = searchParams.get("status")

  try {
    // Интеграция с Jikan API (MyAnimeList) для метаданных
    const jikanUrl = new URL("https://api.jikan.moe/v4/anime")
    if (query) jikanUrl.searchParams.set("q", query)
    if (genre) jikanUrl.searchParams.set("genres", genre)
    if (year) jikanUrl.searchParams.set("start_date", `${year}-01-01`)
    if (status) jikanUrl.searchParams.set("status", status)
    jikanUrl.searchParams.set("page", page.toString())
    jikanUrl.searchParams.set("limit", limit.toString())

    const jikanResponse = await fetchWithRetry(jikanUrl.toString())
    const jikanData = await jikanResponse.json()

    if (!jikanData || !jikanData.data) {
      return NextResponse.json(
        { error: { code: "NO_DATA", message: "No data returned from Jikan" } },
        { status: 502 },
      )
    }

    // Возвращаем базовые данные быстро, озвучки будут загружены отдельно при необходимости
    const enrichedData = jikanData.data.map((anime: any) => ({
      id: anime.mal_id,
      title: anime.title,
      titleEnglish: anime.title_english,
      titleJapanese: anime.title_japanese,
      synopsis: anime.synopsis,
      image: anime.images?.jpg?.large_image_url,
      score: anime.score,
      episodes: anime.episodes,
      status: anime.status,
      year: anime.year,
      genres: anime.genres?.map((g: any) => g.name) || [],
      studios: anime.studios?.map((s: any) => s.name) || [],
      availableDubs: getDefaultDubs(),
      trailer: anime.trailer?.youtube_id,
    }))

    const headers = {
      // Кешируем на CDN/edge 1 час, разрешаем stale-while-revalidate
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    }

    return NextResponse.json({ data: enrichedData, pagination: jikanData.pagination }, { headers })
  } catch (error: any) {
    console.error("Error fetching anime:", error)
    const status = error?.status || 500
    const code = error?.code || "FETCH_ERROR"
    const message = error?.message || "Failed to fetch anime data"
    return NextResponse.json({ error: { code, message } }, { status })
  }
}

function getDefaultDubs() {
  return [
    {
      provider: "anidub",
      quality: ["720p", "1080p"],
      episodes: {},
    },
    {
      provider: "animevost",
      quality: ["480p", "720p", "1080p"],
      episodes: {},
    },
  ]
}
