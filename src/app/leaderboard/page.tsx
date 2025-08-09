
'use client';

import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Smile } from 'lucide-react';
import Image from 'next/image';

const mockLeaderboard = [
  { rank: 1, name: 'Alex', score: 1250, avatar: 'https://placehold.co/40x40' },
  { rank: 2, name: 'Priya', score: 1180, avatar: 'https://placehold.co/40x40' },
  { rank: 3, name: 'Rohan', score: 1120, avatar: 'https://placehold.co/40x40' },
  { rank: 4, name: 'Sam', score: 1050, avatar: 'https://placehold.co/40x40' },
  { rank: 5, name: 'Emily', score: 980, avatar: 'https://placehold.co/40x40' },
];

export default function LeaderboardPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8 bg-background">
      <Header />
      <div className="w-full max-w-4xl mt-20 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            Smile Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2">See who has the most powerful smile!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Smile Champions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeaderboard.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell className="font-medium">{user.rank}</TableCell>
                    <TableCell className="flex items-center gap-4">
                      <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
                      <span>{user.name}</span>
                    </TableCell>
                    <TableCell className="text-right font-bold">{user.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
