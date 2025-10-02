import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { RecentActivity } from "@/components/profile/recent-activity"
import { Achievements } from "@/components/profile/achievements"
import { Header } from "@/components/header"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileHeader />
          <ProfileStats />
          <div className="grid lg:grid-cols-2 gap-8">
            <RecentActivity />
            <Achievements />
          </div>
        </div>
      </main>
    </div>
  )
}
