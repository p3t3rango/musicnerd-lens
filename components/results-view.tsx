'use client'

import { ArrowLeft, Share2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
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
      } catch {
        // User cancelled or share failed
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image section */}
      <div className="relative h-80">
        {/* Background blur */}
        <div 
          className="absolute inset-0 scale-110 blur-2xl opacity-50"
          style={{ 
            backgroundImage: `url(${result.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Main image */}
        <div className="absolute inset-0 flex items-center justify-center pt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl scale-105" />
            <img
              src={result.imageUrl}
              alt={result.identified.name}
              className="relative w-44 h-44 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full w-11 h-11 bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {onSave && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSave} 
                className="rounded-full w-11 h-11 bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/50"
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
              className="rounded-full w-11 h-11 bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/50"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-10 -mt-6 relative z-20">
        {/* Identified item info */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
            <Sparkles className="h-3 w-3" />
            {result.identified.type}
          </span>
          <h1 className="text-3xl font-serif font-medium text-foreground text-balance lowercase">
            {result.identified.name.toLowerCase()}
          </h1>
          {result.identified.artist && (
            <p className="text-lg text-muted-foreground mt-1">
              {result.identified.artist}
            </p>
          )}
          {result.identified.year && (
            <p className="text-sm text-muted-foreground/60 mt-0.5 font-mono">
              {result.identified.year}
            </p>
          )}
        </div>

        {/* Facts section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              The Nerd Facts
            </h2>
            <span className="text-xs text-muted-foreground/50 font-mono">
              {result.facts.length} facts
            </span>
          </div>
          {result.facts.map((fact, index) => (
            <FactCard key={fact.id} fact={fact} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
