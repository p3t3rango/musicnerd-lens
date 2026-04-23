'use client'

import { useEffect, useState } from 'react'
import { Disc3 } from 'lucide-react'

const loadingMessages = [
  "Scanning the vinyl grooves...",
  "Consulting the archives...",
  "Digging through the crates...",
  "Checking the liner notes...",
  "Asking session musicians...",
  "Researching the gear closet...",
  "Tracking down producers...",
  "Finding the deep cuts...",
]

interface AnalyzingViewProps {
  imageUrl: string
}

export function AnalyzingView({ imageUrl }: AnalyzingViewProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(i => (i + 1) % loadingMessages.length)
    }, 2000)
    
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90))
    }, 500)
    
    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 scale-150 blur-3xl opacity-30"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated image container */}
        <div className="relative w-52 h-52 mb-10">
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-2xl border border-primary/30 animate-spin-reverse" />
          
          {/* Glow */}
          <div className="absolute inset-4 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
          
          {/* Image */}
          <div className="absolute inset-4">
            <img
              src={imageUrl}
              alt="Scanning"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
              <div 
                className="absolute left-0 right-0 h-1 bg-primary/60 animate-scan-line"
                style={{ boxShadow: '0 0 30px 8px var(--primary)' }}
              />
            </div>
          </div>
          
          {/* Spinning icon */}
          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
            <Disc3 className="h-6 w-6 text-primary-foreground animate-spin" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-serif font-medium text-foreground mb-2 lowercase">
            analyzing
          </h2>
          <p className="text-muted-foreground h-6 transition-opacity duration-200">
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes scan-line {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
