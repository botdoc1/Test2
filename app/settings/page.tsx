import { SettingsForm } from "@/components/profile/settings-form"
import { Header } from "@/components/header"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Настройки</h1>
            <p className="text-muted-foreground">Управляйте своим аккаунтом и предпочтениями</p>
          </div>
          <SettingsForm />
        </div>
      </main>
    </div>
  )
}
