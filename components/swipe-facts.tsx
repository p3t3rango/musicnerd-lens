'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Disc3, Album, Settings2, Mic2, Clock, Link2, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig: Record<string, { icon: typeof Mic2; label: string; color: string }> = {
  artist: { icon: Mic2, label: 'ARTIST', color: 'text-pink-400' },
  album: { icon: Album, label: 'ALBUM', color: 'text-blue-400' },
  gear: { icon: Settings2, label: 'GEAR', color: 'text-amber-400' },
  production: { icon: Disc3, label: 'PRODUCTION', color: 'text-emerald-400' },
  history: { icon: Clock, label: 'HISTORY', color: 'text-purple-400' },
  connection: { icon: Link2, label: 'CONNECTION', color: 'text-cyan-400' },
}

const defaultConfig = { icon: Disc3, label: 'FACT', color: 'text-gray-400' }

interface SwipeFactsProps {
  facts: MusicFact[]
  isLoadingMore?: boolean
  onRequestMore?: () => void
}

export function SwipeFacts({ facts, isLoadingMore, onRequestMore }: SwipeFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [containerWidth, setContainerWidth] = useState(0)

  // Trigger loading more when user reaches fact 2 (index 1)
  useEffect(() => {
    if (currentIndex === 1 && onRequestMore) {
      onRequestMore()
    }
  }, [currentIndex, onRequestMore])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const currentFact = facts[currentIndex]
  const config = categoryConfig[currentFact?.category] || defaultConfig
  const Icon = config.icon
  
  const hasNext = currentIndex < facts.length - 1
  const hasPrev = currentIndex > 0

  // Smooth progress indicator
  const progress = useTransform(x, [-containerWidth, 0, containerWidth], [
    Math.min((currentIndex + 1) / facts.length, 1),
    currentIndex / facts.length,
    Math.max((currentIndex - 1) / facts.length, 0)
  ])

  const handleDragEnd = (_: never, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = containerWidth * 0.2
    const velocity = info.velocity.x
    const offset = info.offset.x

    if ((offset < -threshold || velocity < -500) && hasNext) {
      // Swipe left - next
      animate(x, -containerWidth, { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        onComplete: () => {
          setCurrentIndex(prev => prev + 1)
          x.set(0)
        }
      })
    } else if ((offset > threshold || velocity > 500) && hasPrev) {
      // Swipe right - prev
      animate(x, containerWidth, { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        onComplete: () => {
          setCurrentIndex(prev => prev - 1)
          x.set(0)
        }
      })
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 })
    }
  }

  // Parallax effect for content
  const contentX = useTransform(x, [-containerWidth, 0, containerWidth], [30, 0, -30])
  const opacity = useTransform(x, [-containerWidth * 0.5, 0, containerWidth * 0.5], [0.5, 1, 0.5])

  if (!currentFact) return null

  return (
    <div className="absolute inset-x-0 bottom-0 pb-8 px-4" ref={containerRef}>
      {/* Minimal progress bar */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="flex-1 max-w-[200px] h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            style={{ width: useTransform(progress, v => `${v * 100}%`) }}
          />
        </div>
        <span className="text-white/30 text-xs tabular-nums min-w-[40px]">
          {currentIndex + 1}/{facts.length}{isLoadingMore && '+'}
        </span>
      </div>

      {/* Swipeable card */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="touch-pan-y"
      >
        <motion.div 
          style={{ x: contentX, opacity }}
          className="backdrop-blur-2xl bg-black/60 rounded-3xl overflow-hidden border border-white/5"
        >
          {/* Card content */}
          <div className="p-6">
            {/* Category + loading indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase",
                config.color
              )}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </div>
              
              {isLoadingMore && currentIndex >= facts.length - 2 && (
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>loading more</span>
                </div>
              )}
            </div>
            
            {/* Headline */}
            <h3 className="text-2xl font-serif text-white leading-tight mb-4">
              {currentFact.headline}
            </h3>
            
            {/* Details */}
            <p className="text-white/60 text-[15px] leading-relaxed">
              {currentFact.details}
            </p>
            
            {/* Source */}
            {currentFact.source && (
              <p className="text-white/25 text-xs mt-4 font-mono">
                {currentFact.source}
              </p>
            )}
          </div>

          {/* Swipe hint footer */}
          {hasNext && (
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end">
              <motion.div 
                className="flex items-center gap-1 text-white/30 text-xs"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span>swipe</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          )}
          
          {/* End state */}
          {!hasNext && !isLoadingMore && (
            <div className="px-6 py-4 border-t border-white/5">
              <p className="text-white/30 text-xs text-center">
                you&apos;ve seen all {facts.length} facts
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
