import type { Metadata } from 'next';
import './globals.css';
import { CelebrateProvider } from '@/lib/context/celebrate-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CelebrateAI | Clarity, Not Chaos in Event Planning',
  description:
    'GenAI-powered celebration & event planner. Generates dynamic budgets, back-scheduled timelines, vendor checklists, and grounded recommendations for weddings, birthdays, and community events.',
  keywords: [
    'CelebrateAI',
    'Event Planner',
    'Wedding Planning',
    'Birthday Budget',
    'Timeline Scheduler',
    'Gemini AI',
    'Bengaluru Events',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fafaf9] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 transition-colors duration-200">
        <CelebrateProvider>
          {/* Accessible Skip to Content Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>

          <Navbar />
          <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </CelebrateProvider>
      </body>
    </html>
  );
}
