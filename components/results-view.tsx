'use client'

import { ArrowLeft, Share2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SwipeFacts } from './swipe-facts'
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
      } catch {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Fullscreen background image */}
      <div className="absolute inset-0">
        <img
          src={result.imageUrl}
          alt={result.identified.name}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation bar */}
        <div className="flex items-center justify-between p-4 pt-safe">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full w-11 h-11 bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {onSave && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSave} 
                className="rounded-full w-11 h-11 bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare} 
              className="rounded-full w-11 h-11 bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Identified item info - top section */}
        <div className="px-5 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-3">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {result.identified.type}
            </span>
          </div>
          <h1 className="text-4xl font-serif font-medium text-white text-balance lowercase leading-tight">
            {result.identified.name.toLowerCase()}
          </h1>
          {result.identified.artist && (
            <p className="text-lg text-white/60 mt-1">
              {result.identified.artist}
            </p>
          )}
          {result.identified.year && (
            <p className="text-sm text-white/40 mt-0.5 font-mono">
              {result.identified.year}
            </p>
          )}
        </div>

        {/* Spacer to push cards to bottom */}
        <div className="flex-1" />

        {/* Swipeable fact cards */}
        <div className="pb-12 pt-4">
          <SwipeFacts facts={result.facts} itemName={result.identified.name} />
        </div>
      </div>
    </div>
  )
}
