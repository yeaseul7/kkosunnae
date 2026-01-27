import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import '@/styles/keyframe.css';
import { AuthProvider } from '@/lib/firebase/auth';
import LocationDataProvider from '@/packages/ui/components/base/LocationDataProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cafe24SsurroundAir = localFont({
  src: [
    {
      path: '../public/static/font/Cafe24SsurroundAir-v1.1/webfont/Cafe24SsurroundAir-v1.1.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/static/font/Cafe24SsurroundAir-v1.1/webfont/Cafe24SsurroundAir-v1.1.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cafe24',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: '꼬순내',
  },
  description: '꼬순내는 전국의 유기동물|유기견|유기묘 등의 정보를 제공하며 예비 반려인과 반려인이 소통할 수 있는 커뮤니티를 제공합니다. 다양한 정보를 주고 받으며 새로운 가족을 만나보세요.',
  icons: {
    icon: '/static/images/logo.png',
    apple: '/static/images/logo.png',
  },
  verification: {
    google: 'WBwV06sSdVI6wLAiXlN3T32MSQlsqxdSv49eMBt7JWs',
  },
  openGraph: {
    title: '꼬순내',
    description: '꼬순내는 전국의 유기동물|유기견|유기묘 등의 정보를 제공하며 예비 반려인과 반려인이 소통할 수 있는 커뮤니티를 제공합니다. 다양한 정보를 주고 받으며 새로운 가족을 만나보세요.',
    url: 'https://kkosunnae.com',
    siteName: 'kkosunnae',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/static/images/logo.png',
        width: 1200,
        height: 630,
        alt: '꼬순내 로고',
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${cafe24SsurroundAir.variable} antialiased w-full min-h-screen font-sans bg-white`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9P3M59NTFM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9P3M59NTFM');
          `}
        </Script>
        {process.env.NEXT_PUBLIC_NAVER_MAP && (
          <Script
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP}`}
            strategy="afterInteractive"
          />
        )}
        <AuthProvider>
          <LocationDataProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
