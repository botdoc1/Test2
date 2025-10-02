import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/header"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Вход в аккаунт</h1>
            <p className="text-muted-foreground">
              Войдите, чтобы получить доступ к избранному и отслеживанию прогресса
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
