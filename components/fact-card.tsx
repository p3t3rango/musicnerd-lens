'use client'

import { useState } from 'react'
import { ChevronDown, Disc3, Album, Settings2, Mic2, Clock, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MusicFact } from '@/lib/types'

const categoryConfig = {
  artist: { icon: Mic2, label: 'Artist', color: 'text-pink-400' },
  album: { icon: Album, label: 'Album', color: 'text-blue-400' },
  gear: { icon: Settings2, label: 'Gear', color: 'text-amber-400' },
  production: { icon: Disc3, label: 'Production', color: 'text-green-400' },
  history: { icon: Clock, label: 'History', color: 'text-purple-400' },
  connection: { icon: Link2, label: 'Connection', color: 'text-cyan-400' },
}

interface FactCardProps {
  fact: MusicFact
  index: number
}

export function FactCard({ fact, index }: FactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = categoryConfig[fact.category]
  const Icon = config.icon

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "w-full text-left bg-card border border-border rounded-xl p-4 transition-all duration-200",
        "hover:border-primary/50 hover:bg-card/80",
        "animate-in fade-in slide-in-from-bottom-2",
        isExpanded && "border-primary/50"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg bg-muted shrink-0", config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-medium uppercase tracking-wide", config.color)}>
              {config.label}
            </span>
          </div>
          <h3 className="font-semibold text-foreground leading-tight">
            {fact.headline}
          </h3>
          <div
            className={cn(
              "grid transition-all duration-200",
              isExpanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fact.details}
              </p>
              {fact.source && (
                <p className="text-xs text-muted-foreground/60 mt-2 italic">
                  Source: {fact.source}
                </p>
              )}
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </div>
    </button>
  )
}
