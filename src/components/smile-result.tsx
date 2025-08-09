'use client';

import Image from 'next/image';
import {
  Download,
  Copy,
  RotateCcw,
  MessageCircle,
  Star,
  Quote,
} from 'lucide-react';
import type { AnalyzeSmileOutput } from '@/ai/flows/analyze-smile';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { smileFacts } from '@/lib/smile-facts';
import { useEffect, useState } from 'react';

interface SmileResultProps {
  result: AnalyzeSmileOutput;
  image: string;
  onReset: () => void;
}

export default function SmileResult({ result, image, onReset }: SmileResultProps) {
  const { toast } = useToast();
  const [fact, setFact] = useState('');

  useEffect(() => {
    setFact(smileFacts[Math.floor(Math.random() * smileFacts.length)]);
  }, []);

  const handleCopy = () => {
    const textToCopy = `I scored ${result.happinessScore}/5 on Smile Snaps and got the title "${result.funnySmileName}"! Try it out!`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to clipboard!',
      description: 'Now go share your amazing smile!',
    });
  };

  const handleShareWhatsApp = () => {
    const text = `I scored ${result.happinessScore}/5 on Smile Snaps and got the title "${result.funnySmileName}"! See if you can beat my score!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const scorePercentage = (result.happinessScore / 5) * 100;

  return (
    <Card className="w-full max-w-lg animate-fade-in-up shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline text-accent">{result.funnySmileName}</CardTitle>
        <CardDescription>Here's the official, very scientific result!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg overflow-hidden border-4 border-primary shadow-md">
          <Image
            src={image}
            alt="Your captured smile"
            width={600}
            height={450}
            className="w-full h-auto"
            data-ai-hint="person smiling"
          />
        </div>
        
        <div className="space-y-2">
            <div className="flex justify-between items-center font-semibold">
                <span>Happiness Score</span>
                <span>{result.happinessScore} / 5</span>
            </div>
            <div className="flex items-center gap-2">
                <Progress value={scorePercentage} className="h-4" />
                <Star className="w-6 h-6 text-primary fill-primary" />
            </div>
        </div>

        {fact && (
            <div className="text-center bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="font-semibold text-sm text-primary-foreground/80 italic">
                    <Quote className="inline-block w-4 h-4 mr-1 -mt-1" />
                    {fact}
                </p>
            </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="mr-2" /> Try Again
        </Button>
        <Button asChild variant="outline">
          <a href={image} download="my-smile.jpg">
            <Download className="mr-2" /> Download
          </a>
        </Button>
        <Button onClick={handleCopy} variant="outline">
          <Copy className="mr-2" /> Copy
        </Button>
        <Button onClick={handleShareWhatsApp}>
          <MessageCircle className="mr-2" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
}
