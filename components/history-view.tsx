'use client'

import { ArrowLeft, Trash2 } from 'lucide-react'
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
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Scan History</h1>
          {history.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive">
              Clear
            </Button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>

      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No scans yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Your scanned items will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.identified.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.identified.name}
                    </h3>
                    {item.identified.artist && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.identified.artist}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDate(item.savedAt)} · {item.facts.length} facts
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
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
