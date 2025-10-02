"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "user" | "premium" | "admin"
  avatar?: string
  level: number
  experience: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem("auth_token")
    if (token) {
      // Проверяем токен на сервере
      ;(async () => {
        try {
          const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          if (res.ok) {
            const data = await res.json()
            setUser(data.user)
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (e) {
          localStorage.removeItem('auth_token')
        }
      })()
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      const { token, user: userData } = data
      localStorage.setItem('auth_token', token)
      if (rememberMe) localStorage.setItem('remember_me', 'true')
      setUser(userData)
    } catch (error) {
      throw new Error((error as Error).message || 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Register failed')

      localStorage.setItem('auth_token', data.token)
      setUser(data.user)
    } catch (error) {
      throw new Error((error as Error).message || 'Ошибка регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("remember_me")
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
