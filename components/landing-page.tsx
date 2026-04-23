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

const rotatingWords = ['Nerd', 'Listener', 'Researcher', 'Collector', 'Curator']

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient orbs for ambient effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/icon-512x512.png"
                alt="MusicNerd"
                width={44}
                height={44}
                className="rounded-2xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground tracking-tight">MusicNerd</span>
              <span className="text-xs text-muted-foreground">Lens</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            className="relative rounded-full w-11 h-11 bg-secondary/50 backdrop-blur-sm border border-border/50 hover:bg-secondary"
          >
            <History className="h-5 w-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </Button>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="text-center max-w-md">
            {/* Logo with glow */}
            <div className="mb-10 relative inline-block">
              <div className="absolute inset-0 bg-primary/40 rounded-[2rem] blur-2xl scale-110" />
              <Image
                src="/icon-512x512.png"
                alt="MusicNerd Lens"
                width={140}
                height={140}
                className="relative rounded-[2rem] shadow-2xl"
              />
            </div>

            {/* Title with rotating word */}
            <div className="mb-6">
              <h1 className="text-5xl font-serif font-medium text-foreground tracking-tight lowercase">
                music{' '}
                <span 
                  className={`inline-block text-primary transition-all duration-200 ${
                    isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                >
                  {rotatingWords[wordIndex].toLowerCase()}
                </span>
              </h1>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10 text-pretty">
              Point your camera at any record, poster, or setlist. Get deep cuts, gear specs, and stories that make you go{' '}
              <span className="text-foreground font-medium">{'"'}wait, really?!{'"'}</span>
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={onStartScan}
              className="w-full h-14 text-base font-semibold gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
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
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 backdrop-blur-sm border border-border/30 rounded-full">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm text-foreground/80">{label}</span>
    </div>
  )
}
