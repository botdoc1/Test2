import { createHmac, timingSafeEqual } from 'crypto'

function base64url(input: Buffer | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function signJWT(payload: Record<string, any>, secret: string, expiresInDays = 7, subject?: string) {
  const header: Record<string, any> = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + expiresInDays * 24 * 60 * 60
  const body: Record<string, any> = { ...payload, iat: now, exp }
  if (subject) (body as any).sub = subject

  const headerB = base64url(JSON.stringify(header))
  const bodyB = base64url(JSON.stringify(body))
  const data = `${headerB}.${bodyB}`
  const sig = createHmac('sha256', secret).update(data).digest()
  const sigB = base64url(sig)
  return `${data}.${sigB}`
}

export function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [headerB, bodyB, sigB] = parts
    const data = `${headerB}.${bodyB}`
    const expectedSig = createHmac('sha256', secret).update(data).digest()
    const sigBuf = Buffer.from(sigB.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    if (sigBuf.length !== expectedSig.length) return null
    if (!timingSafeEqual(sigBuf, expectedSig)) return null
    const payload = JSON.parse(Buffer.from(bodyB.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && now > payload.exp) return null
    return payload
  } catch (e) {
    return null
  }
}
