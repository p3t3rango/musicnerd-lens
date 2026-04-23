'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { Disc3, Album, Settings2, Mic2, Clock, Link2, Loader2 } from 'lucide-react'
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
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (currentIndex === 1 && onRequestMore) {
      onRequestMore()
    }
  }, [currentIndex, onRequestMore])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentFact = facts[currentIndex]
  const config = categoryConfig[currentFact?.category] || defaultConfig
  const Icon = config.icon
  
  const hasNext = currentIndex < facts.length - 1
  const hasPrev = currentIndex > 0

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = containerWidth * 0.15
    const velocity = info.velocity.x
    const offset = info.offset.x

    if ((offset < -threshold || velocity < -300) && hasNext) {
      setDirection(-1)
      animate(x, -containerWidth, { 
        type: "tween", 
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => {
          setCurrentIndex(prev => prev + 1)
          x.set(0)
        }
      })
    } else if ((offset > threshold || velocity > 300) && hasPrev) {
      setDirection(1)
      animate(x, containerWidth, { 
        type: "tween", 
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => {
          setCurrentIndex(prev => prev - 1)
          x.set(0)
        }
      })
    } else {
      animate(x, 0, { type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] })
    }
  }

  const opacity = useTransform(x, [-containerWidth * 0.5, 0, containerWidth * 0.5], [0.3, 1, 0.3])
  const scale = useTransform(x, [-containerWidth * 0.5, 0, containerWidth * 0.5], [0.95, 1, 0.95])

  if (!currentFact) return null

  return (
    <div className="absolute inset-0 flex flex-col" ref={containerRef}>
      {/* Full screen swipeable overlay */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        className="flex-1 flex flex-col justify-end touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <motion.div 
          style={{ opacity, scale }}
          className="flex flex-col justify-end h-full"
        >
          {/* Clean gradient overlay - no blur */}
          <div className="relative">
            {/* Simple gradient fade - no blur distortion */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            
            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-10 px-5 pb-10 pt-24"
              >
                {/* Category tag */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase mb-3 opacity-80",
                  config.color
                )}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </div>
                
                {/* Headline */}
                <h3 className="text-2xl font-serif text-white leading-snug mb-3">
                  {currentFact.headline}
                </h3>
                
                {/* Details */}
                <p className="text-white/75 text-[15px] leading-relaxed mb-6">
                  {currentFact.details}
                </p>

                {/* Simple dot indicators */}
                <div className="flex items-center justify-center gap-2.5">
                  {facts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? -1 : 1)
                        setCurrentIndex(i)
                      }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-opacity duration-200",
                        i === currentIndex 
                          ? "bg-white" 
                          : "bg-white/30"
                      )}
                    />
                  ))}
                  {isLoadingMore && (
                    <Loader2 className="w-3 h-3 animate-spin text-white/40 ml-1" />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
