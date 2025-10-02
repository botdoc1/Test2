import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/db'
import { verifyJWT } from '@/lib/jwt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

const XP_ACTIONS = {
  ADD_FAVORITE: 5,
  ADD_COMMENT: 10,
  WATCH_EPISODE: 15
} as const

type XpAction = keyof typeof XP_ACTIONS

// Рассчитываем опыт для следующего уровня: level² * 100
function getNextLevelXp(level: number): number {
  return Math.floor(Math.pow(level, 2) * 100)
}

// Получаем текущий уровень на основе общего опыта
function getCurrentLevel(totalXp: number): number {
  // Решаем уравнение: x² * 100 = totalXp, где x - уровень
  return Math.floor(Math.sqrt(totalXp / 100))
}

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const users = getUsers()
    const user = users.find((u: { id: string }) => u.id === payload.sub)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const currentXp = user.experience || 0
    const currentLevel = user.level || 1
    const nextLevelXp = getNextLevelXp(currentLevel)
    
    return NextResponse.json({
      data: {
        currentXp,
        currentLevel,
        nextLevelXp,
        progress: (currentXp / nextLevelXp) * 100
      }
    })
  } catch (e) {
    console.error('Error getting user exp:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = auth.replace('Bearer ', '')
    const payload: any = verifyJWT(token, JWT_SECRET)
    if (!payload?.sub) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const body = await req.json()
    const { action } = body as { action: XpAction }
    
    if (!action || !(action in XP_ACTIONS)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const xpToAdd = XP_ACTIONS[action]
    const users = getUsers()
    const userIndex = users.findIndex((u: { id: string }) => u.id === payload.sub)
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[userIndex]
    const currentXp = user.experience || 0
    const newXp = currentXp + xpToAdd
    
    // Обновляем опыт и проверяем повышение уровня
    const oldLevel = user.level || 1
    const newLevel = getCurrentLevel(newXp)
    
    users[userIndex] = {
      ...user,
      experience: newXp,
      level: newLevel
    }
    
    saveUsers(users)

    // Возвращаем обновленные данные
    const nextLevelXp = getNextLevelXp(newLevel)
    const levelUp = newLevel > oldLevel

    return NextResponse.json({
      data: {
        currentXp: newXp,
        currentLevel: newLevel,
        nextLevelXp,
        progress: (newXp / nextLevelXp) * 100,
        gained: xpToAdd,
        levelUp
      }
    })
  } catch (e) {
    console.error('Error adding user exp:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}