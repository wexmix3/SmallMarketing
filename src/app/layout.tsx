import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/design-system.css';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Local Business Marketing Platform',
  description: 'A comprehensive marketing platform for small local businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
