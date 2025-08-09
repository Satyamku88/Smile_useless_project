
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmileFiltersProps {
  image: string;
  onComplete: (imageDataUri: string) => void;
}

const filters = [
  { name: 'None', effect: 'none' },
  { name: 'Sparkles', effect: 'sparkles' },
  { name: 'Vintage', effect: 'grayscale(50%) sepia(30%)' },
  { name: 'Sunny', effect: 'saturate(1.5) contrast(1.1)' },
  { name: 'Cool', effect: 'hue-rotate(-20deg) saturate(1.2)' },
];

export default function SmileFilters({ image, onComplete }: SmileFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const applyFilterAndContinue = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.filter = filters.find(f => f.effect === selectedFilter)?.effect || 'none';

        if (selectedFilter === 'sparkles') {
            ctx.filter = 'none'; // Clear canvas filter to draw sparkles manually
            ctx.drawImage(img, 0, 0);
            
            // Draw some sparkles
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 3 + 1;
                ctx.fillStyle = `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 50 + 50}%)`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
             ctx.drawImage(img, 0, 0);
        }

        onComplete(canvas.toDataURL('image/jpeg'));
    }
  };
  
  // This is a hidden image used to draw on the canvas.
  // We can't use the visible next/image component for this directly.
  useEffect(() => {
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
        imageRef.current = img;
    }
  }, [image]);


  return (
    <Card className="w-full max-w-lg animate-fade-in-up shadow-xl">
        <CardHeader>
            <CardTitle className="text-center text-3xl font-headline flex items-center justify-center gap-2">
                <Wand2 className="w-8 h-8 text-accent" />
                Add some flair!
            </CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg overflow-hidden border-4 border-primary shadow-md">
            <div className='relative w-full h-full'>
                <Image
                    src={image}
                    alt="Your captured smile"
                    width={600}
                    height={450}
                    className="w-full h-auto"
                    style={{ filter: filters.find(f => f.effect === selectedFilter)?.effect || 'none' }}
                />
                 {selectedFilter === 'sparkles' && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                        <Sparkles
                            key={i}
                            className="absolute text-yellow-300"
                            style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 16 + 8}px`,
                            height: `${Math.random() * 16 + 8}px`,
                            animation: `twinkle 1.5s ease-in-out infinite ${i * 0.1}s`,
                            }}
                        />
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.effect}
              variant={selectedFilter === filter.effect ? 'default' : 'outline'}
              onClick={() => setSelectedFilter(filter.effect)}
              className={cn("flex-col h-16", selectedFilter === filter.effect && "border-2 border-primary")}
            >
              <span className="text-sm font-semibold">{filter.name}</span>
            </Button>
          ))}
        </div>
        <style jsx>{`
            @keyframes twinkle {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `}</style>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full font-bold" onClick={applyFilterAndContinue}>
          <Check className="mr-2" /> Looks Good! Analyze it!
        </Button>
      </CardFooter>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}
