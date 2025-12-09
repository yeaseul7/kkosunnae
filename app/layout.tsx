import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/firebase/auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: '꼬순내',
  },
  description: '반려동물의 발자국 저장소',
  icons: {
    icon: '/static/images/logo.png',
    apple: '/static/images/logo.png',
  },
  openGraph: {
    title: '꼬순내',
    description: '반려동물의 발자국 저장소',
    url: 'https://kkosunnae.com',
    siteName: 'kkosunnae',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
