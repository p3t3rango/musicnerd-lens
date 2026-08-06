'use client'

import { ArrowLeft, Trash2, Clock, Disc3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HistoryItem } from '@/lib/types'

interface HistoryViewProps {
  history: HistoryItem[]
  onBack: () => void
  onSelect: (item: HistoryItem) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export function HistoryView({ history, onBack, onSelect, onDelete, onClear }: HistoryViewProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="rounded-full w-10 h-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display uppercase text-xl tracking-tight text-foreground">scan history</h1>
          {history.length > 0 ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClear} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-4"
            >
              Clear
            </Button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>

      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
              <Disc3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-2">No scans yet</p>
            <p className="text-sm text-muted-foreground">
              Your scanned items will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50 hover:bg-secondary/50 hover:border-border transition-all animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <button
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-4 w-full p-3 text-left"
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.identified.name}
                      className="w-18 h-18 object-cover rounded-xl"
                      style={{ width: 72, height: 72 }}
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.identified.name}
                    </h3>
                    {item.identified.artist && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.identified.artist}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.savedAt)}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        {item.facts.length} facts
                      </span>
                    </div>
                  </div>
                </button>
                
                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
