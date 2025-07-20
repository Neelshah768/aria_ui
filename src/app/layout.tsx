import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Support Dashboard - Intelligent Customer Service",
  description: "Modern AI-powered customer support dashboard with real-time analytics and smart automation",
  keywords: ["AI", "customer support", "dashboard", "analytics", "automation"],
  authors: [{ name: "AI Support Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--dark-bg-primary)] text-[var(--dark-text-primary)] overflow-x-hidden`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--dark-bg-card)',
                color: 'var(--dark-text-primary)',
                border: '1px solid var(--dark-border)',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: 'var(--dark-accent-success)',
                  secondary: 'var(--dark-bg-card)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--dark-accent-error)',
                  secondary: 'var(--dark-bg-card)',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
