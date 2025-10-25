import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { getBaseUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Adversarial Vision - Research Toolkit for Hidden Text in AI Vision",
  description: "A research toolkit for exploring methods to hide text in images that LLMs can detect but humans cannot. Experiment with low-contrast text, opacity, micro-fonts, and more.",
  keywords: [
    "adversarial vision",
    "AI research",
    "machine learning security",
    "hidden text detection",
    "AI vision testing",
    "image manipulation",
    "computer vision",
    "LLM research",
    "ethical AI testing",
  ],
  authors: [{ name: "Adversarial Vision" }],
  creator: "Adversarial Vision",
  publisher: "Adversarial Vision",
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Adversarial Vision',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Adversarial Vision - Research Toolkit for Hidden Text in AI Vision",
    description: "Hide text in images that AI can detect but humans cannot see. Experiment with contrast, opacity, micro-fonts, SVG paths, and tiled microtext to test AI visibility boundaries.",
    url: '/',
    siteName: "Adversarial Vision",
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Adversarial Vision - Research Toolkit for Hidden Text in AI Vision",
    description: "Hide text in images that AI can detect but humans cannot see. Experiment with contrast, opacity, micro-fonts, SVG paths, and tiled microtext to test AI visibility boundaries.",
    creator: '@adversarialviz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              fontFamily: 'monospace',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
