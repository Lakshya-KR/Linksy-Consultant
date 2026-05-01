import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Linksy Studio — Websites, AI & Custom Software",
    template: "%s · Linksy Studio",
  },
  description:
    "Linksy is a network of skilled developers, machine-learning engineers, and AI specialists. We deliver websites, ML models, chatbots, and custom software end-to-end — from brief to deployment.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: "Linksy Studio — Websites, AI & Custom Software",
    description:
      "A network of top technical talent. Websites, machine learning, chatbots, and custom software — managed end-to-end.",
    type: "website",
    siteName: "Linksy Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linksy Studio — Websites, AI & Custom Software",
    description:
      "A network of top technical talent. Websites, machine learning, chatbots, and custom software — managed end-to-end.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased min-h-screen grain">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.08 0 0)",
              color: "oklch(0.985 0 0)",
              border: "1px solid oklch(1 0 0 / 0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
