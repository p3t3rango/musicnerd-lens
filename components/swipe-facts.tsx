'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Disc3, Album, Settings2, Mic2, Clock, Link2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig: Record<string, { icon: typeof Mic2; label: string; color: string }> = {
  artist: { icon: Mic2, label: 'ARTIST', color: 'text-pink-400 bg-pink-500/20 border-pink-500/30' },
  album: { icon: Album, label: 'ALBUM', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
  gear: { icon: Settings2, label: 'GEAR', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
  production: { icon: Disc3, label: 'PRODUCTION', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  history: { icon: Clock, label: 'HISTORY', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
  connection: { icon: Link2, label: 'CONNECTION', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
}

const defaultConfig = { icon: Disc3, label: 'FACT', color: 'text-gray-400 bg-gray-500/20 border-gray-500/30' }

interface SwipeFactsProps {
  facts: MusicFact[]
  itemName: string
}

export function SwipeFacts({ facts, itemName }: SwipeFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const currentFact = facts[currentIndex]
  const config = categoryConfig[currentFact?.category] || defaultConfig
  const Icon = config.icon
  
  const hasNext = currentIndex < facts.length - 1
  const hasPrev = currentIndex > 0
  const isComplete = currentIndex >= facts.length

  const goToNext = () => {
    if (hasNext) {
      setDirection(1)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const goToPrev = () => {
    if (hasPrev) {
      setDirection(-1)
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    const velocity = Math.abs(info.velocity.x)
    const offset = info.offset.x

    if (offset < -threshold || (velocity > 300 && info.velocity.x < 0)) {
      goToNext()
    } else if (offset > threshold || (velocity > 300 && info.velocity.x > 0)) {
      goToPrev()
    }
  }

  const handleReset = () => {
    setDirection(-1)
    setCurrentIndex(0)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  return (
    <div className="absolute inset-x-0 bottom-0 pb-6 px-4">
      {/* Progress bar */}
      <div className="flex gap-1.5 justify-center mb-4">
        {facts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1)
              setCurrentIndex(idx)
            }}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === currentIndex 
                ? "w-8 bg-primary" 
                : idx < currentIndex
                  ? "w-3 bg-white/50"
                  : "w-3 bg-white/20"
            )}
          />
        ))}
      </div>

      {/* Card container */}
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence mode="wait" custom={direction}>
          {!isComplete ? (
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 35 },
                opacity: { duration: 0.15 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              {/* Glass card */}
              <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-5 shadow-2xl">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  {/* Category badge */}
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border",
                    config.color
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </div>
                  
                  {/* Fact counter */}
                  <span className="text-white/40 text-sm tabular-nums">
                    {currentIndex + 1} of {facts.length}
                  </span>
                </div>
                
                {/* Headline */}
                <h3 className="text-xl font-serif text-white mb-3 leading-snug">
                  {currentFact.headline}
                </h3>
                
                {/* Full details - always visible */}
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {currentFact.details}
                </p>
                
                {/* Source */}
                {currentFact.source && (
                  <p className="text-white/30 text-xs font-mono mb-4">
                    Source: {currentFact.source}
                  </p>
                )}
                
                {/* Swipe hint */}
                {hasNext && (
                  <div className="flex items-center justify-center pt-3 border-t border-white/10">
                    <span className="text-white/40 text-xs">
                      swipe for more
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-8 text-center"
            >
              <p className="text-white/50 text-sm mb-1">you&apos;ve explored all</p>
              <p className="text-2xl font-serif text-white mb-1">{facts.length} facts</p>
              <p className="text-white/30 text-xs mb-6 lowercase">about {itemName}</p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                view again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
