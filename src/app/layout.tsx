import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUXE BEAUTY — Luxury Beyond Color',
  description:
    'A velvet matte experience crafted for modern beauty. Discover our exclusive lipstick collection inspired by timeless elegance and contemporary sophistication.',
  keywords: [
    'luxury lipstick',
    'premium beauty',
    'velvet matte',
    'luxury cosmetics',
    'high-end beauty',
    'fashion beauty',
  ],
  openGraph: {
    title: 'LUXE BEAUTY — Luxury Beyond Color',
    description:
      'A velvet matte experience crafted for modern beauty.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <SmoothScrollProvider>
          {/* Film grain overlay */}
          <div className="film-grain" aria-hidden="true" />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
