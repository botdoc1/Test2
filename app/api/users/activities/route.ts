import { NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { getActivities } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const activities = getActivities()
    const userActivities = activities
      .filter((a: { userId: string }) => a.userId === payload.sub)
      .sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp)
      .slice(0, 10) // Получаем последние 10 активностей

    return NextResponse.json({
      activities: userActivities
    })
  } catch (e) {
    console.error('Error getting user activities:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}