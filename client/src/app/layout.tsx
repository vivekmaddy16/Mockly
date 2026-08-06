import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Mockly — AI-Powered Interview Preparation & Simulator System',
  description: 'Practice real-time technical & behavioral mock interviews tailored to your Resume and target Job Description. AI-driven answer evaluation, topic practice, and readiness dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-sage text-charcoal min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
