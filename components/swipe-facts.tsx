'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, Album, Settings2, Mic2, Clock, Link2, Loader2, ChevronRight, ExternalLink, Film, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig: Record<string, { icon: typeof Mic2; label: string; color: string }> = {
  artist: { icon: Mic2, label: 'ARTIST', color: 'text-pink-400' },
  album: { icon: Album, label: 'ALBUM', color: 'text-blue-400' },
  gear: { icon: Settings2, label: 'GEAR', color: 'text-amber-400' },
  production: { icon: Disc3, label: 'PRODUCTION', color: 'text-emerald-400' },
  history: { icon: Clock, label: 'HISTORY', color: 'text-purple-400' },
  connection: { icon: Link2, label: 'CONNECTION', color: 'text-cyan-400' },
  soundtrack: { icon: Film, label: 'SOUNDTRACK', color: 'text-orange-400' },
  cultural: { icon: Sparkles, label: 'CULTURAL', color: 'text-rose-400' },
}

const defaultConfig = { icon: Disc3, label: 'FACT', color: 'text-gray-400' }

interface SwipeFactsProps {
  facts: MusicFact[]
  isLoadingMore?: boolean
  onRequestMore?: () => void
}

export function SwipeFacts({ facts, isLoadingMore, onRequestMore }: SwipeFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    if (currentIndex === 1 && onRequestMore) {
      onRequestMore()
    }
  }, [currentIndex, onRequestMore])

  const currentFact = facts[currentIndex]
  const config = categoryConfig[currentFact?.category] || defaultConfig
  const Icon = config.icon
  
  const hasNext = currentIndex < facts.length - 1
  const hasPrev = currentIndex > 0

  const goNext = () => {
    if (hasNext) {
      setDirection(1)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const goPrev = () => {
    if (hasPrev) {
      setDirection(-1)
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        goNext()
      } else if (diff < 0 && hasPrev) {
        goPrev()
      }
    }
    setTouchStart(null)
  }

  if (!currentFact) return null

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  }

  return (
    <>
      <style jsx global>{`
        .fact-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div 
        className="absolute inset-0 flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
      {/* Gradient overlay - covers bottom half */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/90 via-60% to-transparent pointer-events-none" />
      
      {/* Content container - starts below header area */}
      <div className="absolute inset-x-0 bottom-0 top-[45%] flex flex-col px-5 pb-6">
        {/* Scrollable fact content */}
        <div 
          className="fact-scroll flex-1 overflow-y-auto min-h-0 mb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                x: { type: "tween", duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.2 }
              }}
              className="pt-4"
            >
              {/* Category tag */}
              <div className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase mb-3",
                config.color
              )}>
                <Icon className="w-3 h-3" />
                {config.label}
              </div>
              
              {/* Headline */}
              <h3 className="text-2xl font-serif text-white leading-snug mb-4">
                {currentFact.headline}
              </h3>
              
              {/* Details */}
              <p className="text-white/80 text-base leading-relaxed">
                {currentFact.details}
              </p>
              
              {/* Source link */}
              {currentFact.source && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  {currentFact.sourceUrl ? (
                    <a 
                      href={currentFact.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white/50 text-sm hover:text-white/70 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{currentFact.source}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-white/40 text-sm">{currentFact.source}</span>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar with dots and next hint - fixed at bottom */}
        <div className="flex items-center justify-between flex-shrink-0">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {facts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  i === currentIndex 
                    ? "bg-white" 
                    : "bg-white/25"
                )}
              />
            ))}
            {isLoadingMore && (
              <Loader2 className="w-3 h-3 animate-spin text-white/30 ml-1" />
            )}
          </div>
          
          {/* Next hint */}
          {hasNext && (
            <button 
              onClick={goNext}
              className="flex items-center gap-1 text-white/40 text-xs"
            >
              <span>next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Invisible tap zones for navigation */}
      <button 
        onClick={goPrev}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
        aria-label="Previous fact"
      />
      <button 
        onClick={goNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
        aria-label="Next fact"
      />
    </div>
    </>
  )
}
