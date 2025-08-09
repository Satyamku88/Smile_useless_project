
'use client';

import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Smile } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line as RechartsLine,
  CartesianGrid,
} from 'recharts';

const mockGrowthData = [
  { date: 'Jul 1', score: 3 },
  { date: 'Jul 2', score: 4 },
  { date: 'Jul 3', score: 3 },
  { date: 'Jul 4', score: 5 },
  { date: 'Jul 5', score: 4 },
  { date: 'Jul 6', score: 5 },
  { date: 'Jul 7', score: 5 },
];

export default function GrowthPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8 bg-background">
      <Header />
      <div className="w-full max-w-4xl mt-20 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <LineChart className="w-10 h-10 text-primary" />
            Your Smile Growth
          </h1>
          <p className="text-muted-foreground mt-2">Track your happiness journey over time.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>7-Day Smile Trend</CardTitle>
            <CardDescription>Your average daily smile score.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={mockGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <RechartsLine type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
