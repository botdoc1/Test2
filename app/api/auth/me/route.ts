import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/db'
import { verifyJWT } from '@/lib/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ user: null }, { status: 401 })

    const token = auth.replace('Bearer ', '')
  const payload: any = verifyJWT(token, JWT_SECRET)
  const users = getUsers()
  const user = users.find((u: any) => u.id === payload?.sub)
    if (!user) return NextResponse.json({ user: null }, { status: 404 })

    return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
