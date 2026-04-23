'use client'

import { Camera, History, Disc3, Mic2, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface LandingPageProps {
  onStartScan: () => void
  onOpenHistory: () => void
  historyCount: number
}

export function LandingPage({ onStartScan, onOpenHistory, historyCount }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/icon-512x512.png"
            alt="MusicNerd"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-semibold text-lg text-foreground">MusicNerd</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenHistory}
          className="relative"
        >
          <History className="h-5 w-5" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="text-center max-w-sm">
          <div className="mb-6">
            <Image
              src="/icon-512x512.png"
              alt="MusicNerd Lens"
              width={120}
              height={120}
              className="mx-auto rounded-3xl shadow-2xl shadow-primary/20"
            />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3 text-balance">
            Point. Scan. Nerd Out.
          </h1>

          <p className="text-muted-foreground mb-8 text-balance leading-relaxed">
            Aim your camera at any record, poster, or setlist and get the full MusicNerd treatment — gear specs, deep cuts, and stories that&apos;ll make you say &quot;wait, really?!&quot;
          </p>

          <Button
            size="lg"
            onClick={onStartScan}
            className="w-full h-14 text-lg font-semibold gap-2 bg-primary hover:bg-primary/90"
          >
            <Camera className="h-5 w-5" />
            Start Scanning
          </Button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm">
          <FeatureChip icon={Disc3} label="Albums" />
          <FeatureChip icon={Mic2} label="Artists" />
          <FeatureChip icon={Settings2} label="Gear" />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <a 
          href="https://musicnerd.xyz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          musicnerd.xyz
        </a>
      </footer>
    </div>
  )
}

function FeatureChip({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-xl">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
