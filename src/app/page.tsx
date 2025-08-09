
'use client';

import { useState } from 'react';
import { Smile, Zap, LoaderCircle, PartyPopper } from 'lucide-react';
import { rateSmile } from './actions';
import type { AnalyzeSmileOutput } from '@/ai/flows/analyze-smile';
import SmileCapture from '@/components/smile-capture';
import SmileResult from '@/components/smile-result';
import SmileFilters from '@/components/smile-filters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';

type AppState = 'idle' | 'capturing' | 'filtering' | 'loading' | 'result';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSmileOutput | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCapture = (imageDataUri: string) => {
    setCapturedImage(imageDataUri);
    setAppState('filtering');
  };

  const handleFilterSelect = async (imageDataUri: string) => {
    setAppState('loading');
    setCapturedImage(imageDataUri);
    setError(null);

    try {
      const result = await rateSmile(imageDataUri);
      if (result) {
        setAnalysisResult(result);
        setAppState('result');
      } else {
        throw new Error('AI analysis failed to return a result.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'Could not analyze smile. Please try again.',
      });
      setAppState('capturing'); // Go back to capture screen on error
    }
  };

  const handleReset = () => {
    setAppState('capturing');
    setAnalysisResult(null);
    setCapturedImage(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return (
          <div className="flex flex-col items-center gap-8 text-center animate-fade-in-up">
            <div className="rounded-full bg-primary/20 p-6">
              <Smile className="h-24 w-24 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-foreground/90">
                Welcome to Smile Snaps!
              </h1>
              <p className="text-lg text-muted-foreground">
                Rate your smile for absolutely no reason.
              </p>
            </div>
            <Button
              size="lg"
              className="font-bold text-lg"
              onClick={() => setAppState('capturing')}
            >
              <PartyPopper className="mr-2 h-6 w-6" />
              Let's Get Started!
            </Button>
          </div>
        );
      case 'capturing':
        return <SmileCapture onCapture={handleCapture} />;
      case 'filtering':
        if (capturedImage) {
          return <SmileFilters image={capturedImage} onComplete={handleFilterSelect} />;
        }
        setAppState('capturing');
        return null;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center animate-fade-in-up">
            <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold">Analyzing your grin...</h2>
            <p className="text-muted-foreground">The AI is judging your happiness levels!</p>
          </div>
        );
      case 'result':
        if (analysisResult && capturedImage) {
          return (
            <SmileResult
              result={analysisResult}
              image={capturedImage}
              onReset={handleReset}
            />
          );
        }
        // Fallback to idle if result is somehow missing
        setAppState('idle');
        return null;

      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8 bg-background">
      <Header />
      <div className="w-full max-w-2xl mt-16">{renderContent()}</div>
    </main>
  );
}
