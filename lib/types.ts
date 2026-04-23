export interface MusicFact {
  id: string
  category: 'artist' | 'album' | 'gear' | 'production' | 'history' | 'connection' | 'soundtrack' | 'cultural'
  headline: string
  details: string
  source?: string
  sourceUrl?: string
}

export interface ScanResult {
  id: string
  timestamp: number
  imageUrl: string
  identified: {
    type: 'album' | 'artist' | 'poster' | 'setlist' | 'gear' | 'toy' | 'movie' | 'product' | 'other' | 'unknown'
    name: string
    artist?: string
    year?: string
  }
  facts: MusicFact[]
}

export interface HistoryItem extends ScanResult {
  savedAt: number
}
