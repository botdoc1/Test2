"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AnimeGrid } from "@/components/anime-grid"

export default function TopPage() {
  const [searchFilters, setSearchFilters] = useState<{ query?: string; genre?: string; year?: string; status?: string; sort?: string }>({ sort: "score_desc" })

  useEffect(() => {
    // В будущем можно вызвать API с сортировкой по рейтингу
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Топ аниме</h1>
          <AnimeGrid searchFilters={searchFilters} />
        </section>
      </main>
    </div>
  )
}
