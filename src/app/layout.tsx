
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a suitable modern font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is globally available

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Changed from geist to inter
});

export const metadata: Metadata = {
  title: 'Overwatch Progression Tracker',
  description: 'Track your Overwatch 2 hero progression and sub-badges.',
  manifest: '/manifest.json', // Added manifest link for PWA
  themeColor: '#1E2E4A', // Explicitly set theme-color via metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      {/* 
        The <head> tag is no longer manually defined here.
        Next.js will automatically construct and populate the <head> 
        based on the 'metadata' export and the linked manifest.json.
      */}
      <body className="antialiased font-sans"> {/* Use --font-inter through font-sans utility */}
        {children}
        <Toaster /> {/* Global Toaster for notifications */}
      </body>
    </html>
  );
}

