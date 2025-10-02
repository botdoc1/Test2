"use client"
import { useEffect } from "react"

export default function UnregisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !('serviceWorker' in navigator)) return

    let mounted = true

    ;(async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        if (!mounted) return
        for (const r of regs) {
          try {
            await r.unregister()
            // also try to clear caches for dev cleanliness
            if (typeof caches !== 'undefined') {
              const keys = await caches.keys()
              await Promise.all(keys.map(k => caches.delete(k)))
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return null
}
