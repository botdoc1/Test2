import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"

interface SimilarAnimeProps {
  animeId: number
}

const similarAnime = [
  {
    id: 2,
    title: "Наруто",
    rating: 8.7,
    year: 2002,
    episodes: 720,
    poster: "/naruto-poster.jpg",
  },
  {
    id: 3,
    title: "Ван Пис",
    rating: 9.2,
    year: 1999,
    episodes: 1000,
    poster: "/anime-pirate-poster.png",
  },
  {
    id: 4,
    title: "Магическая битва",
    rating: 8.9,
    year: 2020,
    episodes: 24,
    poster: "/jujutsu-kaisen-poster.jpg",
  },
  {
    id: 5,
    title: "Клинок, рассекающий демонов",
    rating: 8.8,
    year: 2019,
    episodes: 44,
    poster: "/demon-slayer-poster.jpg",
  },
]

export function SimilarAnime({ animeId }: SimilarAnimeProps) {
  return (
    <div className="glass-effect rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Похожие аниме</h3>
        <Button variant="ghost" size="sm">
          Все
        </Button>
      </div>

      <div className="space-y-3">
        {similarAnime.map((anime) => (
          <div
            key={anime.id}
            className="flex space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            {/* Poster */}
            <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <img
                src={anime.poster || "/placeholder.svg"}
                alt={anime.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-medium text-sm truncate">{anime.title}</h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {anime.rating}
                </div>
                <span>•</span>
                <span>{anime.year}</span>
              </div>
              <div className="text-xs text-muted-foreground">{anime.episodes} эп.</div>
              <Button size="sm" className="w-full mt-2">
                <Play className="w-3 h-3 mr-1" />
                Смотреть
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
