import { NextResponse } from 'next/server'
import { getFavorites, saveFavorites } from '@/lib/db'
import { verifyJWT } from '@/lib/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  const favs = getFavorites()
  if (auth) {
    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (payload?.sub) {
      const userFavs = favs.filter((f: any) => f.userId === payload.sub)
      return NextResponse.json({ data: userFavs })
    }
  }
  return NextResponse.json({ data: favs })
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: true, message: 'Unauthorized' }, { status: 401 })
    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: true, message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { animeId } = body
    if (!animeId) return NextResponse.json({ error: true, message: 'Missing fields' }, { status: 400 })

    const favs = getFavorites()
    // prevent duplicates
    if (favs.find((f: any) => f.userId === payload.sub && f.animeId === animeId)) {
      return NextResponse.json({ success: true })
    }
    favs.push({ id: String(Date.now()), userId: payload.sub, animeId })
    saveFavorites(favs)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: true, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: true, message: 'Unauthorized' }, { status: 401 })
    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: true, message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { animeId } = body
    if (!animeId) return NextResponse.json({ error: true, message: 'Missing fields' }, { status: 400 })

    let favs = getFavorites()
    const initialLen = favs.length
    favs = favs.filter((f: any) => !(f.userId === payload.sub && f.animeId === animeId))
    if (favs.length === initialLen) {
      return NextResponse.json({ success: true })
    }
    saveFavorites(favs)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: true, message: 'Server error' }, { status: 500 })
  }
}
