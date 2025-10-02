import { NextResponse } from 'next/server'
import { getComments, saveComments } from '@/lib/db'

export async function GET(req: Request) {
  const comments = getComments()
  return NextResponse.json({ data: comments })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, animeId, text } = body
    if (!userId || !animeId || !text) return NextResponse.json({ error: true, message: 'Missing fields' }, { status: 400 })

    const comments = getComments()
    const newComment = { id: String(Date.now()), userId, animeId, text, createdAt: new Date().toISOString() }
    comments.push(newComment)
    saveComments(comments)
    return NextResponse.json({ success: true, comment: newComment })
  } catch (e) {
    return NextResponse.json({ error: true, message: 'Server error' }, { status: 500 })
  }
}
