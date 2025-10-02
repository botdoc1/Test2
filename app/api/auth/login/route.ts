import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { signJWT } from '@/lib/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json({ error: true, message: 'Missing fields' }, { status: 400 })
    }

    const users = getUsers()
    const user = users.find((u: any) => u.email === email)
    if (!user) return NextResponse.json({ error: true, message: 'Invalid credentials' }, { status: 401 })

  const match = await verifyPassword(user.password, password)
  if (!match) return NextResponse.json({ error: true, message: 'Invalid credentials' }, { status: 401 })

    const token = signJWT({ email: user.email }, JWT_SECRET, 7, user.id)

    return NextResponse.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (e) {
    return NextResponse.json({ error: true, message: 'Server error' }, { status: 500 })
  }
}
