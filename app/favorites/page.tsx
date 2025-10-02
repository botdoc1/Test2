import { FavoritesList } from "@/components/profile/favorites-list"
import { Header } from "@/components/header"

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Избранное</h1>
            <p className="text-muted-foreground">Ваши любимые аниме в одном месте</p>
          </div>
          <FavoritesList />
        </div>
      </main>
    </div>
  )
}
