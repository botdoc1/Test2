"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchSectionProps {
  onSearch: (filters: {
    query?: string
    genre?: string
    year?: string
    status?: string
  }) => void
}

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Horror",
  "Sports",
  "Slice of Life",
  "Supernatural",
]

const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const removeGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre))
  }

  const handleSearch = () => {
    onSearch({
      query: query.trim() || undefined,
      genre: selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
      year: selectedYear || undefined,
      status: selectedStatus || undefined,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setQuery("")
    setSelectedGenres([])
    setSelectedYear("")
    setSelectedStatus("")
    onSearch({})
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Search Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Найди своё аниме</h2>
            <p className="text-muted-foreground">
              Используй поиск и фильтры, чтобы найти идеальное аниме для просмотра
            </p>
          </div>

          {/* Main Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Введите название аниме..."
                className="pl-12 h-12 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button variant="outline" size="lg" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-5 h-5 mr-2" />
              Фильтры
            </Button>
            <Button size="lg" onClick={handleSearch}>
              <Search className="w-5 h-5 mr-2" />
              Найти
            </Button>
          </div>

          {/* Active Filters */}
          {(selectedGenres.length > 0 || selectedYear || selectedStatus || query) && (
            <div className="flex flex-wrap gap-2 items-center">
              {query && (
                <Badge variant="default" className="px-3 py-1">
                  Поиск: "{query}"
                </Badge>
              )}
              {selectedYear && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setSelectedYear("")}
                >
                  Год: {selectedYear}
                  <X className="w-3 h-3 ml-2" />
                </Badge>
              )}
              {selectedStatus && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setSelectedStatus("")}
                >
                  Статус:{" "}
                  {selectedStatus === "airing"
                    ? "Выходит"
                    : selectedStatus === "complete"
                      ? "Завершено"
                      : selectedStatus}
                  <X className="w-3 h-3 ml-2" />
                </Badge>
              )}
              {selectedGenres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeGenre(genre)}
                >
                  {genre}
                  <X className="w-3 h-3 ml-2" />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Очистить всё
              </Button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="glass-effect rounded-xl p-6 space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Год выпуска</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите год" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Статус</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Статус аниме" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airing">Выходит</SelectItem>
                      <SelectItem value="complete">Завершено</SelectItem>
                      <SelectItem value="upcoming">Анонсировано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Рейтинг</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Минимальный рейтинг" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9.0+</SelectItem>
                      <SelectItem value="8">8.0+</SelectItem>
                      <SelectItem value="7">7.0+</SelectItem>
                      <SelectItem value="6">6.0+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Genres */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Жанры</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
