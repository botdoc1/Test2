import { Button } from "@/components/ui/button"
import { Play, Star, Calendar } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">Погрузись</span>
                <br />в мир аниме
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Тысячи аниме в высоком качестве. Смотри онлайн без рекламы, сохраняй прогресс и открывай новые миры.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Начать просмотр
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Star className="w-5 h-5 mr-2" />
                Топ аниме
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Аниме</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">50000+</div>
                <div className="text-sm text-muted-foreground">Эпизодов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Пользователей</div>
              </div>
            </div>
          </div>

          {/* Featured Anime Card */}
          <div className="relative">
            <div className="card-hover glass-effect rounded-2xl p-6 space-y-4">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <Play className="w-16 h-16 text-primary/60" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Атака титанов</h3>
                <p className="text-sm text-muted-foreground">
                  Эпическая история о выживании человечества в мире, где правят гигантские титаны.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    9.0
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    2013
                  </div>
                </div>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  Смотреть
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
