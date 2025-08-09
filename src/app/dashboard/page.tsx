
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Flame, Star, Trophy, Instagram, Facebook, Camera, LayoutDashboard, Smile } from 'lucide-react';
import Header from '@/components/header';

// Mock data - in a real app, this would come from localStorage or a database
const mockHistory = [
  { date: '2024-07-29', score: 5, image: 'https://placehold.co/600x400', name: 'Supernova Smile' },
  { date: '2024-07-28', score: 4, image: 'https://placehold.co/600x400', name: 'Beaming with Joy' },
  { date: '2024-07-27', score: 3, image: 'https://placehold.co/600x400', name: 'Solid Grin' },
];

export default function DashboardPage() {
    const [history, setHistory] = useState(mockHistory);
    const [totalScore, setTotalScore] = useState(0);
    const [smileStreak, setSmileStreak] = useState(0);

    useEffect(() => {
        // In a real app, you would fetch and calculate this data
        const calculatedTotalScore = history.reduce((acc, item) => acc + item.score, 0);
        setTotalScore(calculatedTotalScore);

        // Mock streak calculation
        setSmileStreak(3); 
    }, [history]);

    const handleShare = (platform: 'instagram' | 'facebook') => {
        const text = `I have a ${smileStreak}-day smile streak and a total score of ${totalScore} on Smile Snaps!`;
        const url = `https://example.com`; // Replace with your app's URL
        let shareUrl = '';

        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        } else if (platform === 'instagram') {
            // Instagram sharing is more complex and usually done via their mobile app deeplinks.
            // This is a placeholder alert.
            alert("To share on Instagram, please take a screenshot and share it from your photo library!");
            return;
        }

        window.open(shareUrl, '_blank');
    };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8 bg-background">
      <Header />
      <div className="w-full max-w-4xl mt-20 space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
                <LayoutDashboard className="w-10 h-10 text-primary" />
                Your Smile Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">A gallery of your glorious grins.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalScore}</div>
                    <p className="text-xs text-muted-foreground">Across {history.length} smiles</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Smile Streak</CardTitle>
                    <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{smileStreak} days</div>
                    <p className="text-xs text-muted-foreground">Keep it going!</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Rank</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Supernova Smile</div>
                    <p className="text-xs text-muted-foreground">Your highest rated smile</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Share Your Stats</CardTitle>
                <CardDescription>Let the world see your smile power!</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4">
                <Button onClick={() => handleShare('facebook')}>
                    <Facebook className="mr-2" /> Share on Facebook
                </Button>
                 <Button onClick={() => handleShare('instagram')} variant="outline">
                    <Instagram className="mr-2" /> Share on Instagram
                </Button>
            </CardFooter>
        </Card>

        {/* Smile History */}
        <div>
            <h2 className="text-2xl font-bold mb-4">Smile History</h2>
            {history.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {history.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                                <Image src={item.image} alt={`Smile from ${item.date}`} width={400} height={300} className="w-full h-auto" />
                                <div className="p-4">
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < item.score ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Alert>
                    <Smile className="h-4 w-4" />
                    <AlertTitle>No Smiles Yet!</AlertTitle>
                    <AlertDescription>
                        You haven't captured any smiles yet. Go to the <Link href="/" className="font-bold underline">camera</Link> to get started!
                    </AlertDescription>
                </Alert>
            )}
        </div>
      </div>
    </main>
  );
}
