'use client'

import { useState, useCallback } from 'react'
import { LandingPage } from './landing-page'
import { Scanner } from './scanner'
import { AnalyzingView } from './analyzing-view'
import { ResultsView } from './results-view'
import { HistoryView } from './history-view'
import { useScanHistory } from '@/hooks/use-scan-history'
import type { ScanResult, HistoryItem } from '@/lib/types'

type AppView = 'landing' | 'scanning' | 'analyzing' | 'results' | 'history'

export function MusicNerdApp() {
  const [view, setView] = useState<AppView>('landing')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { history, saveToHistory, removeFromHistory, clearHistory } = useScanHistory()

  const handleCapture = useCallback(async (imageData: string) => {
    setCapturedImage(imageData)
    setView('analyzing')
    setError(null)

    try {
      // Quick analysis - get 3 facts fast
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imageData,
          mode: 'quick'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()

      const result: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        imageUrl: imageData,
        identified: data.identified,
        facts: data.facts
      }

      setCurrentResult(result)
      setView('results')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError('Failed to analyze image. Please try again.')
      setView('scanning')
    }
  }, [])

  const handleSaveResult = useCallback(() => {
    if (currentResult) {
      saveToHistory(currentResult)
    }
  }, [currentResult, saveToHistory])

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setCurrentResult(item)
    setCapturedImage(item.imageUrl)
    setView('results')
  }, [])

  const isCurrentResultSaved = currentResult
    ? history.some(item => item.id === currentResult.id)
    : false

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onStartScan={() => setView('scanning')}
          onOpenHistory={() => setView('history')}
          historyCount={history.length}
        />
      )}

      {view === 'scanning' && (
        <Scanner
          onCapture={handleCapture}
          onClose={() => setView('landing')}
        />
      )}

      {view === 'analyzing' && capturedImage && (
        <AnalyzingView imageUrl={capturedImage} />
      )}

      {view === 'results' && currentResult && (
        <ResultsView
          result={currentResult}
          onBack={() => setView('landing')}
          onSave={handleSaveResult}
          isSaved={isCurrentResultSaved}
        />
      )}

      {view === 'history' && (
        <HistoryView
          history={history}
          onBack={() => setView('landing')}
          onSelect={handleSelectHistoryItem}
          onDelete={removeFromHistory}
          onClear={clearHistory}
        />
      )}

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-destructive/90 backdrop-blur-sm text-white p-4 rounded-2xl text-center text-sm border border-white/10">
          {error}
        </div>
      )}
    </>
  )
}
