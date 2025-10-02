import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(stored: string, password: string) {
  try {
    const [salt, key] = stored.split(':')
    if (!salt || !key) return false
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer
    const keyBuf = Buffer.from(key, 'hex')
    if (derivedKey.length !== keyBuf.length) return false
    return timingSafeEqual(derivedKey, keyBuf)
  } catch (e) {
    return false
  }
}
