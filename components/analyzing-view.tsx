'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  "Scanning the vinyl grooves...",
  "Consulting the music archives...",
  "Digging through the crates...",
  "Checking the liner notes...",
  "Asking the session musicians...",
  "Researching the gear closet...",
  "Tracking down the producers...",
  "Finding the deep cuts...",
]

interface AnalyzingViewProps {
  imageUrl: string
}

export function AnalyzingView({ imageUrl }: AnalyzingViewProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % loadingMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8">
      <div className="relative w-48 h-48 mb-8">
        <img
          src={imageUrl}
          alt="Scanning"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent animate-pulse" />
          <div 
            className="absolute left-0 right-0 h-1 bg-primary/80 animate-scan"
            style={{
              boxShadow: '0 0 20px 5px var(--primary)'
            }}
          />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Analyzing...
        </h2>
        <p className="text-muted-foreground animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
