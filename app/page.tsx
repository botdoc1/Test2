"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AnimeGrid } from "@/components/anime-grid"
import { SearchSection } from "@/components/search-section"

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState<{
    query?: string
    genre?: string
    year?: string
    status?: string
  }>({})

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SearchSection onSearch={handleSearch} />
        <AnimeGrid searchFilters={searchFilters} />
      </main>
    </div>
  )
}
