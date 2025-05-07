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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans"> {/* Use --font-inter through font-sans utility */}
        {children}
        <Toaster /> {/* Global Toaster for notifications */}
      </body>
    </html>
  );
}
