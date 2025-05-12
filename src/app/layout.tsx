
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; 

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
});

export const metadata: Metadata = {
  title: 'Overwatch Progression Tracker',
  description: 'Track your Overwatch 2 hero progression and sub-badges.',
  manifest: '/manifest.json', 
  themeColor: '#1E2E4A', 
  icons: {
    icon: '/favicon.ico', // Ensure this path is correct for root deployment
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans"> 
        {children}
        <Toaster /> 
      </body>
    </html>
  );
}

