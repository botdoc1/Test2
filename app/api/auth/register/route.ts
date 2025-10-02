import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { signJWT } from '@/lib/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, password } = body
    if (!username || !email || !password) {
      return NextResponse.json({ error: true, message: 'Missing fields' }, { status: 400 })
    }

    const users = getUsers()
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ error: true, message: 'Email already registered' }, { status: 409 })
    }

  const hashed = await hashPassword(password)
  const newUser = { id: String(Date.now()), username, email, password: hashed, role: 'user', level: 1 }
    users.push(newUser)
    saveUsers(users)

  const token = signJWT({ email: newUser.email }, JWT_SECRET, 7, newUser.id)

    return NextResponse.json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role } })
  } catch (e) {
    return NextResponse.json({ error: true, message: 'Server error' }, { status: 500 })
  }
}
