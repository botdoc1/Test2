"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Reply, Flag, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface CommentSectionProps {
  animeId: number
}

const mockComments = [
  {
    id: 1,
    user: {
      name: "Анимешник2024",
      avatar: "/anime-fan-avatar.png",
      level: "Премиум",
    },
    content:
      "Невероятное аниме! Каждая серия держит в напряжении. Анимация на высшем уровне, особенно сцены боёв с титанами.",
    timestamp: "2 часа назад",
    likes: 15,
    dislikes: 1,
    replies: 3,
  },
  {
    id: 2,
    user: {
      name: "OtakuMaster",
      avatar: "/otaku-avatar.png",
      level: "Модератор",
    },
    content: "Согласен с предыдущим комментарием. Сюжет становится всё интереснее с каждым сезоном. Рекомендую всем!",
    timestamp: "5 часов назад",
    likes: 8,
    dislikes: 0,
    replies: 1,
  },
  {
    id: 3,
    user: {
      name: "AnimeNewbie",
      avatar: "/abstract-user-avatar.png",
      level: "Новичок",
    },
    content: "Только начал смотреть, но уже затянуло! Спасибо за рекомендацию друзьям.",
    timestamp: "1 день назад",
    likes: 5,
    dislikes: 0,
    replies: 0,
  },
]

export function CommentSection({ animeId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const { toast } = useToast()
  
  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: 'Войдите, чтобы оставить комментарий',
          })
          return
        }

        // TODO: Добавить API для комментариев
        console.log("Отправка комментария:", newComment)

        // Начисляем опыт за комментарий
        const expRes = await fetch('/api/users/exp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ action: 'ADD_COMMENT' })
        })

        if (expRes.ok) {
          const data = await expRes.json()
          if (data.data.levelUp) {
            toast({
              title: `Уровень повышен!`,
              description: `Поздравляем! Вы достигли ${data.data.currentLevel} уровня!`,
            })
          } else {
            toast({
              description: `+${data.data.gained} опыта за комментарий`,
            })
          }
        }

        setNewComment("")
      } catch (e) {
        console.error(e)
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Не удалось отправить комментарий',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Комментарии ({mockComments.length})</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Сортировка:</span>
          <Button variant="outline" size="sm">
            По новизне
          </Button>
        </div>
      </div>

      {/* Add Comment */}
      <div className="glass-effect rounded-xl p-4 space-y-4">
        <Textarea
          placeholder="Поделитесь своими впечатлениями об аниме..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Осталось символов: {500 - newComment.length}</div>
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            Отправить комментарий
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="glass-effect rounded-xl p-4 space-y-3">
            {/* Comment Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <Badge
                      variant={
                        comment.user.level === "Премиум"
                          ? "default"
                          : comment.user.level === "Модератор"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {comment.user.level}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{comment.timestamp}</div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Пожаловаться
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Reply className="w-4 h-4 mr-2" />
                    Ответить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comment Content */}
            <p className="text-sm leading-relaxed">{comment.content}</p>

            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {comment.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                <ThumbsDown className="w-4 h-4 mr-1" />
                {comment.dislikes}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Reply className="w-4 h-4 mr-1" />
                Ответить {comment.replies > 0 && `(${comment.replies})`}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      <div className="text-center">
        <Button variant="outline">Загрузить ещё комментарии</Button>
      </div>
    </div>
  )
}
