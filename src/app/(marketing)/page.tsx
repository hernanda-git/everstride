'use client';

import dynamic from 'next/dynamic';

// Dynamically import the dashboard component with SSR disabled
const DashboardPageClient = dynamic(() => import('../(dashboard)/dashboard/DashboardPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <DashboardPageClient />;
}
