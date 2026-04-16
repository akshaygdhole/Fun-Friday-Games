import { useEffect, useState } from "react"

export default function FullscreenButton({ className = "" }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    onChange()
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      // ignore
    }
  }

  const merged = [
    className,
    "fullscreen-btn",
    isFullscreen ? "fullscreen-btn--exit" : "fullscreen-btn--enter",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type="button"
      className={merged}
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit full screen (Esc)" : "Enter full screen for sharing"}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? "Exit full screen" : "Full screen"}
    </button>
  )
}
