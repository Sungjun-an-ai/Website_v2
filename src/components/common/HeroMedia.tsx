type HeroMediaProps = {
  /** Admin-supplied hero media URL (image or video). Falls back when empty. */
  mediaUrl?: string
  /** Built-in video used when no admin media is set. */
  fallbackVideoSrc: string
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i

export default function HeroMedia({ mediaUrl, fallbackVideoSrc }: HeroMediaProps) {
  const src = mediaUrl?.trim() || fallbackVideoSrc

  if (VIDEO_EXT.test(src)) {
    return (
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
  )
}
