'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, ImageIcon, X, SwitchCamera, Scan } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScannerProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function Scanner({ onCapture, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
      setStream(newStream)
      setError(null)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera access denied. Upload an image instead.')
    }
  }, [stream])

  useEffect(() => {
    startCamera(facingMode)

    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(d => d.kind === 'videoinput')
      setHasMultipleCameras(videoDevices.length > 1)
    })

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const switchCamera = useCallback(() => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newFacing)
    startCamera(newFacing)
  }, [facingMode, startCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    onCapture(imageData)
  }, [onCapture])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      onCapture(imageData)
    }
    reader.readAsDataURL(file)
  }, [onCapture])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full w-11 h-11 bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white"
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
          <Scan className="h-4 w-4 text-primary" />
          <span className="text-sm text-white/80">Point at music</span>
        </div>
        
        {hasMultipleCameras ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={switchCamera}
            className="rounded-full w-11 h-11 bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white"
          >
            <SwitchCamera className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-11" />
        )}
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-background">
            <div className="text-center space-y-6 max-w-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">
                  You can still upload photos from your library
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose from Library
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Scan frame overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Darkened edges */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
              
              {/* Scan frame */}
              <div className="absolute inset-12 sm:inset-20 border-2 border-white/30 rounded-3xl">
                {/* Corner accents */}
                <div className="absolute -top-[2px] -left-[2px] w-12 h-12 border-t-[3px] border-l-[3px] border-primary rounded-tl-3xl" />
                <div className="absolute -top-[2px] -right-[2px] w-12 h-12 border-t-[3px] border-r-[3px] border-primary rounded-tr-3xl" />
                <div className="absolute -bottom-[2px] -left-[2px] w-12 h-12 border-b-[3px] border-l-[3px] border-primary rounded-bl-3xl" />
                <div className="absolute -bottom-[2px] -right-[2px] w-12 h-12 border-b-[3px] border-r-[3px] border-primary rounded-br-3xl" />
                
                {/* Animated scan line */}
                <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-10">
        <div className="flex items-center justify-center gap-8">
          {/* Upload button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-6 w-6" />
          </Button>

          {/* Capture button */}
          <button
            onClick={capturePhoto}
            disabled={!!error}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-black/50"
          >
            <div className="w-16 h-16 rounded-full border-4 border-background flex items-center justify-center">
              <Camera className="h-7 w-7 text-background" />
            </div>
          </button>

          {/* Spacer */}
          <div className="w-14" />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 8px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 10px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
