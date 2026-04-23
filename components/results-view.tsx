'use client'

import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FactCard } from './fact-card'
import type { ScanResult } from '@/lib/types'

interface ResultsViewProps {
  result: ScanResult
  onBack: () => void
  onSave?: () => void
  isSaved?: boolean
}

export function ResultsView({ result, onBack, onSave, isSaved }: ResultsViewProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MusicNerd: ${result.identified.name}`,
          text: `Check out these facts about ${result.identified.name}!`,
          url: window.location.href
        })
      } catch (e) {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <img
          src={result.imageUrl}
          alt={result.identified.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <Button variant="secondary" size="icon" onClick={onBack} className="bg-background/80 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {onSave && (
              <Button variant="secondary" size="icon" onClick={onSave} className="bg-background/80 backdrop-blur">
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button variant="secondary" size="icon" onClick={handleShare} className="bg-background/80 backdrop-blur">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8 -mt-8 relative z-20">
        {/* Identified item */}
        <div className="mb-6">
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {result.identified.type}
          </span>
          <h1 className="text-2xl font-bold text-foreground mt-1 text-balance">
            {result.identified.name}
          </h1>
          {result.identified.artist && (
            <p className="text-lg text-muted-foreground">
              {result.identified.artist}
            </p>
          )}
          {result.identified.year && (
            <p className="text-sm text-muted-foreground">
              {result.identified.year}
            </p>
          )}
        </div>

        {/* Facts */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            The Nerd Facts
          </h2>
          {result.facts.map((fact, index) => (
            <FactCard key={fact.id} fact={fact} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
