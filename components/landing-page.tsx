'use client'

import { Camera, History, Disc3, Mic2, Headphones, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LandingPageProps {
  onStartScan: () => void
  onOpenHistory: () => void
  historyCount: number
}

const rotatingWords = ['nerd', 'listener', 'researcher', 'collector', 'curator']

export function LandingPage({ onStartScan, onOpenHistory, historyCount }: LandingPageProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length)
        setIsAnimating(false)
      }, 200)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Minimal header - just history button */}
        <header className="flex items-center justify-end p-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            className="relative rounded-full w-11 h-11 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
          >
            <History className="h-5 w-5 text-foreground/70" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </Button>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="text-center max-w-md">
            {/* Logo - no background, transparent */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-150" />
              <Image
                src="/icon-512x512.png"
                alt="MusicNerd"
                width={120}
                height={120}
                className="relative drop-shadow-2xl"
              />
            </div>

            {/* Title with rotating word */}
            <div className="mb-3">
              <h1 className="text-4xl sm:text-5xl font-serif text-foreground tracking-tight whitespace-nowrap">
                music{' '}
                <span 
                  className={`inline-block text-primary transition-all duration-200 ${
                    isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                >
                  {rotatingWords[wordIndex]}
                </span>
              </h1>
            </div>

            {/* App name */}
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-8">
              Lens
            </p>

            <p className="text-muted-foreground text-base leading-relaxed mb-10 text-pretty">
              Point your camera at any record, poster, or setlist. Get deep cuts, gear specs, and stories that make you go{' '}
              <span className="text-foreground font-medium">{'"'}wait, really?!{'"'}</span>
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={onStartScan}
              className="w-full h-14 text-base font-semibold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="h-5 w-5" />
              Start Scanning
            </Button>

            {/* Feature pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <FeaturePill icon={Disc3} label="Albums" />
              <FeaturePill icon={Mic2} label="Artists" />
              <FeaturePill icon={Headphones} label="Gear" />
              <FeaturePill icon={Sparkles} label="Deep Cuts" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-5 text-center">
          <a 
            href="https://musicnerd.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            musicnerd.xyz
          </a>
        </footer>
      </div>
    </div>
  )
}

function FeaturePill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm text-foreground/80">{label}</span>
    </div>
  )
}
