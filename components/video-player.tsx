interface VideoPlayerProps {
  src: string | null
  isPlaying: boolean
  isMuted: boolean
  showControls: boolean
}

export function VideoPlayer({ src, isPlaying, isMuted, showControls }: VideoPlayerProps) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        Выберите озвучку и качество
      </div>
    )
  }

  return (
    <video
      className="w-full h-full"
      src={src}
      controls={showControls}
      muted={isMuted}
      autoPlay={isPlaying}
    />
  )
}