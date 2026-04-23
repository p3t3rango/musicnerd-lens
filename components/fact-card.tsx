'use client'

import { useState } from 'react'
import { ChevronRight, Disc3, Album, Settings2, Mic2, Clock, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig: Record<string, { icon: typeof Mic2; label: string; gradient: string }> = {
  artist: { icon: Mic2, label: 'Artist', gradient: 'from-pink-500/20 to-pink-500/5' },
  album: { icon: Album, label: 'Album', gradient: 'from-blue-500/20 to-blue-500/5' },
  gear: { icon: Settings2, label: 'Gear', gradient: 'from-amber-500/20 to-amber-500/5' },
  production: { icon: Disc3, label: 'Production', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  history: { icon: Clock, label: 'History', gradient: 'from-purple-500/20 to-purple-500/5' },
  connection: { icon: Link2, label: 'Connection', gradient: 'from-cyan-500/20 to-cyan-500/5' },
}

const defaultConfig = { icon: Disc3, label: 'Fact', gradient: 'from-gray-500/20 to-gray-500/5' }
const defaultColors = 'text-gray-400 bg-gray-500/10 border-gray-500/20'

const categoryColors: Record<string, string> = {
  artist: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  album: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  gear: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  production: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  history: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  connection: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
}

interface FactCardProps {
  fact: MusicFact
  index: number
}

export function FactCard({ fact, index }: FactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = categoryConfig[fact.category] || defaultConfig
  const colorClasses = categoryColors[fact.category] || defaultColors
  const Icon = config.icon

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "w-full text-left relative overflow-hidden rounded-2xl transition-all duration-300",
        "bg-secondary/30 backdrop-blur-md border border-border/50",
        "hover:bg-secondary/50 hover:border-border",
        "animate-in fade-in slide-in-from-bottom-3",
        isExpanded && "bg-secondary/60 border-border"
      )}
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
    >
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity",
        config.gradient,
        isExpanded && "opacity-80"
      )} />
      
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Category badge */}
          <div className={cn(
            "shrink-0 p-2.5 rounded-xl border",
            colorClasses
          )}>
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Category label */}
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              colorClasses.split(' ')[0]
            )}>
              {config.label}
            </span>
            
            {/* Headline */}
            <h3 className="font-semibold text-foreground leading-snug mt-0.5 pr-6">
              {fact.headline}
            </h3>
            
            {/* Expandable content */}
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fact.details}
                </p>
                {fact.source && (
                  <p className="text-[11px] text-muted-foreground/50 mt-3 font-mono">
                    Source: {fact.source}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Expand indicator */}
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground/50 shrink-0 transition-transform duration-300 mt-1",
              isExpanded && "rotate-90"
            )}
          />
        </div>
      </div>
    </button>
  )
}
