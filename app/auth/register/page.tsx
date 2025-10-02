import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/header"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold">Регистрация</h1>
            <p className="text-muted-foreground">
              Создайте аккаунт, чтобы сохранять избранное и отслеживать прогресс просмотра
            </p>
          </div>

          <RegisterForm />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
