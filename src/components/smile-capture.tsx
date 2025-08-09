'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Video, VideoOff, CircleDotDashed, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SmileCaptureProps {
  onCapture: (imageDataUri: string) => void;
}

export default function SmileCapture({ onCapture }: SmileCaptureProps) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [sunglassesOn, setSunglassesOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sunglassesRef = useRef<SVGImageElement>(null);

  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
  }, []);

  const startCamera = async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        let message = 'Could not access the camera. Please check permissions.';
        if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
                message = 'Camera access was denied. Please enable it in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                message = 'No camera found. Please connect a camera and try again.';
            }
        }
        setError(message);
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: message,
        });
      }
    } else {
      const message = 'Your browser does not support camera access.';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: message,
      });
    }
  };

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        if (sunglassesOn && sunglassesRef.current) {
            // The sunglasses SVG is drawn relative to the video feed.
            // Since the canvas is flipped, we don't need to do any complex calculations.
            // We just draw the SVG on top.
            // For a real app, you might use face detection to place the glasses.
            const svgNode = sunglassesRef.current;
            const svgData = new XMLSerializer().serializeToString(svgNode);
            const img = new Image();
            img.onload = () => {
              // We need to un-flip the context to draw the image correctly, then flip back.
              context.scale(-1, 1);
              context.translate(-canvas.width, 0);
              
              // Simple positioning for demo purposes
              const glassesWidth = canvas.width * 0.6;
              const glassesHeight = (img.height / img.width) * glassesWidth;
              const glassesX = (canvas.width - glassesWidth) / 2;
              const glassesY = (canvas.height - glassesHeight) / 2.5;
              context.drawImage(img, glassesX, glassesY, glassesWidth, glassesHeight);
              
              // Get data URI after drawing glasses
              const imageDataUri = canvas.toDataURL('image/jpeg');
              onCapture(imageDataUri);
              stopCamera();
            };
            img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
            return; // Return early because image loading is async
        }

        const imageDataUri = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUri);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex w-full flex-col items-center gap-4 animate-fade-in-up">
      <Card className="w-full max-w-lg overflow-hidden shadow-lg">
        <CardContent className="p-2 bg-muted/30">
          <div className="aspect-video w-full rounded-md overflow-hidden relative flex items-center justify-center bg-gray-900">
            <video
              ref={videoRef}
              className={`h-full w-full object-cover transform -scale-x-100 ${isCameraOn ? 'block' : 'hidden'}`}
              playsInline
            />
            {sunglassesOn && isCameraOn && (
                <svg
                    ref={sunglassesRef}
                    className="absolute w-3/5 h-auto pointer-events-none"
                    viewBox="0 0 1024 384"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ top: '25%'}} // Adjust vertical position
                >
                  <path d="M128 0H0V128H128V0Z" fill="black"/>
                  <path d="M256 128V0H128V128H256Z" fill="black"/>
                  <path d="M384 128V0H256V128H384Z" fill="black"/>
                  <path d="M512 128V0H384V128H512Z" fill="black"/>
                  <path d="M512 0H384V128H512V0Z" fill="black"/>
                  <path d="M1024 0H896V128H1024V0Z" fill="black"/>
                  <path d="M896 128V0H768V128H896Z" fill="black"/>
                  <path d="M768 128V0H640V128H768Z" fill="black"/>
                  <path d="M640 128V0H512V128H640Z" fill="black"/>
                  <path d="M128 128H0V256H128V128Z" fill="black"/>
                  <path d="M256 256V128H128V256H256Z" fill="black"/>
                  <path d="M384 256V128H256V256H384Z" fill="black"/>
                  <path d="M1024 128H896V256H1024V128Z" fill="black"/>
                  <path d="M896 256V128H768V256H896Z" fill="black"/>
                  <path d="M768 256V128H640V256H768Z" fill="black"/>
                  <path d="M128 256H0V384H128V256Z" fill="black"/>
                  <path d="M256 384V256H128V384H256Z" fill="black"/>
                  <path d="M1024 256H896V384H1024V256Z" fill="black"/>
                  <path d="M896 384V256H768V384H896Z" fill="black"/>
                </svg>
            )}
             {!isCameraOn && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <VideoOff className="h-16 w-16" />
                    <p>Camera is off</p>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-4/5 border-4 border-dashed border-primary/50 rounded-full opacity-50" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {error && <p className="text-destructive text-center">{error}</p>}
      
      <div className="flex items-center gap-4">
        {!isCameraOn ? (
          <Button size="lg" onClick={startCamera}>
            <Camera className="mr-2 h-6 w-6" /> Start Camera
          </Button>
        ) : (
          <>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCaptureClick}>
              <CircleDotDashed className="mr-2 h-6 w-6 animate-pulse" /> Capture Smile
            </Button>
            <Button size="lg" variant="outline" onClick={stopCamera}>
                <VideoOff className="mr-2 h-6 w-6" /> Stop Camera
            </Button>
          </>
        )}
      </div>

       {isCameraOn && (
        <div className="flex items-center space-x-2">
          <Switch id="sunglasses-mode" checked={sunglassesOn} onCheckedChange={setSunglassesOn} />
          <Label htmlFor="sunglasses-mode" className="flex items-center gap-2">
            <Glasses /> Sunglasses Mode
          </Label>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
