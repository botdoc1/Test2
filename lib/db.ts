import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function readJson(fileName: string) {
  ensureDataDir()
  const fp = path.join(dataDir, fileName)
  if (!fs.existsSync(fp)) return null
  try {
    const raw = fs.readFileSync(fp, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function getActivities() {
  return readJson('activities.json') || []
}

export function saveActivity(activity: {
  userId: string
  type: string
  animeId: number
  title: string
  episode?: string
}) {
  const activities = getActivities()
  const newActivity = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    ...activity,
  }
  activities.unshift(newActivity)
  
  // Храним только последние 100 активностей
  if (activities.length > 100) {
    activities.length = 100
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'activities.json'),
    JSON.stringify(activities, null, 2),
    'utf-8'
  )
  return newActivity
}

function writeJson(fileName: string, data: any) {
  ensureDataDir()
  const fp = path.join(dataDir, fileName)
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf-8')
}

export function getUsers() {
  return readJson('users.json') || []
}

export function saveUsers(users: any[]) {
  writeJson('users.json', users)
}

export function getFavorites() {
  return readJson('favorites.json') || []
}

export function saveFavorites(favs: any[]) {
  writeJson('favorites.json', favs)
}

export function getComments() {
  return readJson('comments.json') || []
}

export function saveComments(comments: any[]) {
  writeJson('comments.json', comments)
}
