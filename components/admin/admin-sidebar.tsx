"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Панель управления",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: Users,
    badge: "1,234",
  },
  {
    title: "Контент",
    href: "/admin/content",
    icon: FileText,
    badge: "5,678",
  },
  {
    title: "Комментарии",
    href: "/admin/comments",
    icon: MessageSquare,
    badge: "23",
  },
  {
    title: "Аналитика",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Модерация",
    href: "/admin/moderation",
    icon: Shield,
    badge: "5",
  },
  {
    title: "Жалобы",
    href: "/admin/reports",
    icon: AlertTriangle,
    badge: "12",
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 glass-effect border-r min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href && "bg-primary text-primary-foreground")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant={pathname === item.href ? "secondary" : "outline"} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
