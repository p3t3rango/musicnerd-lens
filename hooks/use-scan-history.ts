'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ScanResult, HistoryItem } from '@/lib/types'

const STORAGE_KEY = 'musicnerd-scan-history'
const MAX_HISTORY_ITEMS = 50

export function useScanHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load scan history:', e)
    }
    setIsLoaded(true)
  }, [])

  const saveToHistory = useCallback((result: ScanResult) => {
    setHistory(prev => {
      const newItem: HistoryItem = {
        ...result,
        savedAt: Date.now()
      }
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save scan history:', e)
      }
      return updated
    })
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to update scan history:', e)
      }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear scan history:', e)
    }
  }, [])

  return {
    history,
    isLoaded,
    saveToHistory,
    removeFromHistory,
    clearHistory
  }
}
