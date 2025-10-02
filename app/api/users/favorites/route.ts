import { NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { getFavorites } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const favorites = getFavorites()
    const userFavorites = favorites.filter((f: { userId: string }) => f.userId === payload.sub)

    return NextResponse.json({
      favorites: userFavorites
    })
  } catch (e) {
    console.error('Error getting user favorites:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}