'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, ImageIcon, X, SwitchCamera } from 'lucide-react'
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
      setError('Could not access camera. Please allow camera permissions or upload an image.')
    }
  }, [stream])

  useEffect(() => {
    startCamera(facingMode)

    // Check for multiple cameras
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
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <span className="text-sm text-muted-foreground">Point at music</span>
        {hasMultipleCameras && (
          <Button variant="ghost" size="icon" onClick={switchCamera}>
            <SwitchCamera className="h-6 w-6" />
          </Button>
        )}
        {!hasMultipleCameras && <div className="w-10" />}
      </div>

      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Image
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
            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-primary/50 rounded-2xl">
                <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
                <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
                <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
                <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex items-center justify-center gap-6">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
          onClick={capturePhoto}
          disabled={!!error}
        >
          <Camera className="h-7 w-7" />
        </Button>

        <div className="w-12" />
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
    </div>
  )
}
