import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import './globals.css';
import '@/styles/keyframe.css';
import { AuthProvider } from '@/lib/firebase/auth';

const LocationDataProvider = dynamic(
  () => import('@/packages/ui/components/base/LocationDataProvider'),
  { ssr: true }
);

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
    template: '%s | 꼬순내',
    default: '꼬순내 - 가족을 기다리는 따뜻한 발걸음, 유기동물 입양 커뮤니티',
  },
  description: '사지 말고 입양하세요! 꼬순내에서 전국의 유기견·유기묘 공고를 확인하고, 따뜻한 반려 생활 노하우를 커뮤니티에서 함께 나누어 보세요. 당신의 소중한 새 가족이 기다리고 있습니다.',
  keywords: ['유기동물입양', '유기견', '유기묘', '반려견커뮤니티', '유기동물보호소', '강아지분양', '고양이분양', '꼬순내'],
  icons: {
    icon: '/static/images/IconLogo.png',
    apple: '/static/images/IconLogo.png',
  },
  verification: {
    google: 'WBwV06sSdVI6wLAiXlN3T32MSQlsqxdSv49eMBt7JWs',
  },
  openGraph: {
    title: '꼬순내 - 새로운 가족을 만나는 가장 따뜻한 방법',
    description: '전국 유기동물 실시간 정보부터 반려인들을 위한 소통의 장까지, 지금 꼬순내에서 확인해보세요! 🐾',
    url: 'https://kkosunnae.com',
    siteName: '꼬순내 (Kkosunnae)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/static/images/bannerImg.jpeg',
        width: 1200,
        height: 630,
        alt: '꼬순내 - 유기동물 입양 및 반려인 커뮤니티',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '꼬순내 - 사지 말고 입양하세요',
    description: '전국의 유기동물 정보와 반려인 커뮤니티를 한곳에서! 당신의 가족을 찾아보세요.',
    images: ['/static/images/bannerImg.jpeg'],
  },
};

export const viewport = {
  themeColor: '#FFD700',
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
