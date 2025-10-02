"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchSection } from "@/components/search-section"
import { AnimeGrid } from "@/components/anime-grid"

export default function GenresPage() {
  const [searchFilters, setSearchFilters] = useState<{ query?: string; genre?: string; year?: string; status?: string }>({})

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SearchSection onSearch={handleSearch} />
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Жанры</h1>
          <AnimeGrid searchFilters={searchFilters} />
        </section>
      </main>
    </div>
  )
}
