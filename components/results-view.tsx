'use client'

import { useState, useCallback, useRef } from 'react'
import { ArrowLeft, Share2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SwipeFacts } from './swipe-facts'
import type { ScanResult, MusicFact } from '@/lib/types'

interface ResultsViewProps {
  result: ScanResult
  onBack: () => void
  onSave?: () => void
  isSaved?: boolean
}

export function ResultsView({ result, onBack, onSave, isSaved }: ResultsViewProps) {
  const [facts, setFacts] = useState<MusicFact[]>(result.facts)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const hasRequestedMore = useRef(false)

  const loadMoreFacts = useCallback(async () => {
    if (hasRequestedMore.current || isLoadingMore) return
    hasRequestedMore.current = true
    setIsLoadingMore(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: result.imageUrl,
          mode: 'deep',
          context: {
            name: result.identified.name,
            type: result.identified.type,
            existingFacts: facts
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFacts(prev => [...prev, ...data.facts])
      }
    } catch (error) {
      console.error('Failed to load more facts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [result.imageUrl, result.identified, facts, isLoadingMore])

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
        {/* Layered gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)] opacity-40" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation bar */}
        <div className="flex items-center justify-between p-4 pt-safe">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {onSave && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSave} 
                className="rounded-full w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 text-white"
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
              className="rounded-full w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/60 text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Identified item info */}
        <div className="px-5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 mb-3">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {result.identified.type}
            </span>
          </div>
          <h1 className="text-3xl font-serif text-white text-balance lowercase leading-tight">
            {result.identified.name.toLowerCase()}
          </h1>
          {result.identified.artist && result.identified.artist !== result.identified.name && (
            <p className="text-base text-white/50 mt-1">
              {result.identified.artist}
            </p>
          )}
          {result.identified.year && (
            <p className="text-xs text-white/30 mt-0.5 font-mono">
              {result.identified.year}
            </p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Swipeable facts */}
        <SwipeFacts 
          facts={facts} 
          isLoadingMore={isLoadingMore}
          onRequestMore={loadMoreFacts}
        />
      </div>
    </div>
  )
}
