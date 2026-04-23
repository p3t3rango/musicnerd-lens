'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Disc3, Album, Settings2, Mic2, Clock, Link2, ChevronDown, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig: Record<string, { icon: typeof Mic2; label: string; color: string }> = {
  artist: { icon: Mic2, label: 'Artist', color: 'text-pink-400' },
  album: { icon: Album, label: 'Album', color: 'text-blue-400' },
  gear: { icon: Settings2, label: 'Gear', color: 'text-amber-400' },
  production: { icon: Disc3, label: 'Production', color: 'text-emerald-400' },
  history: { icon: Clock, label: 'History', color: 'text-purple-400' },
  connection: { icon: Link2, label: 'Connection', color: 'text-cyan-400' },
}

const defaultConfig = { icon: Disc3, label: 'Fact', color: 'text-gray-400' }

interface SwipeFactsProps {
  facts: MusicFact[]
  itemName: string
}

function FactSwipeCard({ 
  fact, 
  isTop,
  isFirst,
  onSwipe,
  style
}: { 
  fact: MusicFact
  isTop: boolean
  isFirst: boolean
  onSwipe: (direction: 'left' | 'right') => void
  style?: React.CSSProperties
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = categoryConfig[fact.category] || defaultConfig
  const Icon = config.icon
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left')
    }
  }

  return (
    <motion.div
      className={cn(
        "absolute inset-x-4 bottom-0",
        isTop ? "cursor-grab active:cursor-grabbing z-10" : "z-0"
      )}
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0, 
        opacity: isTop ? opacity : 0.6,
        ...style 
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-black/40 backdrop-blur-xl border border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isExpanded ? "pb-4" : ""
        )}
        onClick={() => isTop && setIsExpanded(!isExpanded)}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* First card special "DID YOU KNOW?" banner */}
        {isFirst && isTop && (
          <div className="bg-gradient-to-r from-primary/80 to-primary/60 px-5 py-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground">
              Did you know?
            </p>
          </div>
        )}
        
        <div className={cn("relative p-5", isFirst && isTop ? "pt-4" : "")}>
          {/* Category pill */}
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full",
              "bg-white/10 backdrop-blur-sm border border-white/10"
            )}>
              <Icon className={cn("h-3.5 w-3.5", config.color)} />
              <span className={cn("text-xs font-semibold uppercase tracking-wider", config.color)}>
                {config.label}
              </span>
            </div>
            
            {isTop && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-white/40" />
              </motion.div>
            )}
          </div>
          
          {/* Headline - bigger for first card */}
          <h3 className={cn(
            "font-semibold text-white leading-tight mb-2",
            isFirst && isTop ? "text-2xl" : "text-xl"
          )}>
            {fact.headline}
          </h3>
          
          {/* Show snippet of details on first card even when collapsed */}
          {isFirst && isTop && !isExpanded && (
            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-2">
              {fact.details}
            </p>
          )}
          
          {/* Expandable details */}
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className={cn(
              "text-white/70 text-sm leading-relaxed",
              isFirst && isTop ? "" : "pt-2"
            )}>
              {isFirst && isTop ? fact.details.slice(fact.details.indexOf('.') + 1).trim() || fact.details : fact.details}
            </p>
            {fact.source && (
              <p className="text-white/30 text-xs mt-3 font-mono">
                Source: {fact.source}
              </p>
            )}
          </motion.div>
          
          {/* Tap hint */}
          {isTop && !isExpanded && (
            <p className="text-white/30 text-xs mt-2">
              Tap to {isFirst ? "read more" : "expand"}
            </p>
          )}
        </div>
        
        {/* Swipe direction indicators that appear while dragging */}
        {isTop && (
          <>
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold"
              style={{ opacity: useTransform(x, [-100, -30, 0], [1, 0.5, 0]) }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              PREV
            </motion.div>
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold"
              style={{ opacity: useTransform(x, [0, 30, 100], [0, 0.5, 1]) }}
            >
              NEXT
              <ChevronRight className="h-3.5 w-3.5" />
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export function SwipeFacts({ facts, itemName }: SwipeFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [, setExitDirection] = useState<'left' | 'right' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSwipe = (direction: 'left' | 'right') => {
    setExitDirection(direction)
    setTimeout(() => {
      if (direction === 'right') {
        // Swipe right = next fact
        setCurrentIndex(prev => Math.min(prev + 1, facts.length))
      } else {
        // Swipe left = previous fact
        setCurrentIndex(prev => Math.max(prev - 1, 0))
      }
      setExitDirection(null)
    }, 200)
  }

  const handleReset = () => {
    setCurrentIndex(0)
  }

  const visibleFacts = facts.slice(currentIndex, currentIndex + 3)
  const isComplete = currentIndex >= facts.length

  return (
    <div ref={containerRef} className="relative h-96">
      {/* Persistent swipe direction hints at edges */}
      {!isComplete && (
        <>
          {currentIndex > 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center pl-1">
              <motion.div 
                className="flex items-center justify-center w-8 h-16 rounded-r-full bg-white/5 border border-white/10 border-l-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ChevronLeft className="h-4 w-4 text-white/40" />
              </motion.div>
            </div>
          )}
          {currentIndex < facts.length - 1 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pr-1">
              <motion.div 
                className="flex items-center justify-center w-8 h-16 rounded-l-full bg-primary/10 border border-primary/20 border-r-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ChevronRight className="h-4 w-4 text-primary" />
              </motion.div>
            </div>
          )}
        </>
      )}

      <AnimatePresence mode="popLayout">
        {!isComplete ? (
          visibleFacts.map((fact, index) => (
            <FactSwipeCard
              key={fact.id}
              fact={fact}
              isTop={index === 0}
              isFirst={currentIndex === 0 && index === 0}
              onSwipe={handleSwipe}
              style={{
                transform: `scale(${1 - index * 0.05}) translateY(${index * -12}px)`,
                zIndex: visibleFacts.length - index
              }}
            />
          )).reverse()
        ) : (
          <motion.div 
            key="complete"
            className="absolute inset-x-4 bottom-0 flex flex-col items-center justify-center py-12 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center">
              <p className="text-white/60 text-sm mb-1">You&apos;ve seen all</p>
              <p className="text-2xl font-serif text-white mb-4">{facts.length} facts</p>
              <p className="text-white/40 text-xs mb-6 lowercase">about {itemName}</p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                View Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress indicator */}
      {!isComplete && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {facts.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index < currentIndex 
                  ? "w-4 bg-primary" 
                  : index === currentIndex 
                    ? "w-6 bg-white" 
                    : "w-2 bg-white/30"
              )}
            />
          ))}
        </div>
      )}
      
      {/* First-time swipe hint with direction */}
      {!isComplete && currentIndex === 0 && (
        <motion.div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/40 text-xs"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> back
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1 text-primary/80">
            next <ChevronRight className="h-3 w-3" />
          </span>
        </motion.div>
      )}
    </div>
  )
}
