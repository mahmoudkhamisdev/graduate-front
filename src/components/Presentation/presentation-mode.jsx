"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import SlideView from "src/components/Presentation/slide-view"
import { usePresentation } from "src/context/presentation-context"

export default function PresentationMode() {
  const { slides, currentSlideIndex, setCurrentSlideIndex, setIsPresentationMode } = usePresentation()

  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [lastMouseMove, setLastMouseMove] = useState(Date.now())

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1)
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex(currentSlideIndex - 1)
        }
      } else if (e.key === "Escape") {
        setIsPresentationMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlideIndex, slides.length, setCurrentSlideIndex, setIsPresentationMode])

  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true)
      setLastMouseMove(Date.now())
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMouseMove > 3000) {
        setIsControlsVisible(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastMouseMove])

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <SlideView slide={slides[currentSlideIndex]} isActive={true} isPresentationMode={true} />

        {isControlsVisible && (
          <>
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setIsPresentationMode(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white/10 p-2 rounded-full">
              <button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToPreviousSlide}
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <span className="text-white">
                {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToNextSlide}
                disabled={currentSlideIndex === slides.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
