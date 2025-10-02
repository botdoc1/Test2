"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Check, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Episode {
  id: number
  number: number
  title: string
  duration: string
  watched: boolean
  sources?: { [quality: string]: string }
}

interface EpisodeListProps {
  episodes: Episode[]
  currentEpisode: number
  onEpisodeSelect?: (episodeNumber: number) => void
}

export function EpisodeList({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("all")

  const filteredEpisodes = episodes.filter((episode) => episode.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="glass-effect rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Список серий</h3>
        <Badge variant="secondary">{episodes.length} эпизодов</Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск серий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Episodes List */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {filteredEpisodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => onEpisodeSelect?.(episode.number)}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                episode.number === currentEpisode ? "bg-primary/10 border-primary" : "border-border"
              }`}
            >
              {/* Episode Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {episode.watched ? <Check className="w-4 h-4 text-green-500" /> : episode.number}
              </div>

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{episode.title}</div>
                <div className="text-xs text-muted-foreground">{episode.duration}</div>
              </div>

              {/* Play Button */}
              <Button
                size="sm"
                variant={episode.number === currentEpisode ? "default" : "ghost"}
                className="flex-shrink-0"
                onClick={() => onEpisodeSelect?.(episode.number)}
              >
                <Play className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Progress */}
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Прогресс просмотра</span>
          <span>
            {episodes.filter((e) => e.watched).length}/{episodes.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(episodes.filter((e) => e.watched).length / episodes.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
