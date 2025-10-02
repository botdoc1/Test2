import { NextResponse } from "next/server"
import { getDubProvider } from "@/lib/providers/index"

const PROVIDER_CACHE_TTL = 1000 * 60 * 2 // 2 минуты
const providerQualitiesCache = new Map<string, { ts: number; qualities: string[] }>()

function withTimeout<T>(p: Promise<T>, ms = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    p.then((v) => {
      clearTimeout(t)
      resolve(v)
    }).catch((e) => {
      clearTimeout(t)
      reject(e)
    })
  })
}

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const { searchParams } = new URL(request.url)
  const animeId = Number(searchParams.get('animeId'))
  const episode = Number(searchParams.get('episode'))
  const pageUrl = searchParams.get('pageUrl') || undefined

  const cacheKey = `${name}::${animeId}::${episode}::${pageUrl || ''}`
  const cached = providerQualitiesCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < PROVIDER_CACHE_TTL) {
    return NextResponse.json({ qualities: cached.qualities })
  }

  const provider = getDubProvider(name)
  if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 })

  try {
    // call provider with a timeout wrapper
    const qualities = await withTimeout(provider.getAvailableQualities(animeId, episode), 3000)
    providerQualitiesCache.set(cacheKey, { ts: Date.now(), qualities })
    return NextResponse.json({ qualities })
  } catch (e) {
    console.error('Provider qualities error', e)
    // Dev-friendly fallback to avoid 500s when upstream provider is unreachable
    const fallback = ["1080p", "720p", "480p"]
    providerQualitiesCache.set(cacheKey, { ts: Date.now(), qualities: fallback })
    return NextResponse.json({ qualities: fallback })
  }
}
