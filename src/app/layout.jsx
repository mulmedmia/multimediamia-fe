import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mia2026.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Multimedia in Action 2026",
    template: "%s | Multimedia in Action 2026",
  },
  description:
    "Kompetisi Digital Creative Terbesar untuk Mahasiswa Indonesia. Kembangkan potensi inovasi digital bersama Multimedia in Action 2026.",
  keywords: [
    "Multimedia in Action",
    "MIA 2026",
    "Kompetisi Mahasiswa",
    "Web Development",
    "UI UX Design",
    "Digital Creative",
    "KSM Multimedia",
    "Lomba IT Nasional",
    "Show It",
  ],
  authors: [{ name: "KSM Multimedia" }],
  creator: "KSM Multimedia",
  publisher: "KSM Multimedia",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", type: "image/x-icon" },
      { url: "/icon.png?v=2", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/icon.png?v=2",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Multimedia in Action 2026",
    title: "Multimedia in Action 2026",
    description: "Kompetisi Digital Creative Terbesar untuk Mahasiswa Indonesia.",
    images: [
      {
        url: "/mia2026_logo.png",
        width: 1200,
        height: 630,
        alt: "Multimedia in Action 2026 Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Multimedia in Action 2026",
    description: "Kompetisi Digital Creative Terbesar untuk Mahasiswa Indonesia.",
    images: ["/mia2026_logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Multimedia in Action 2026",
  description: "Kompetisi Digital Creative Terbesar untuk Mahasiswa Indonesia",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  organizer: {
    "@type": "Organization",
    name: "KSM Multimedia",
    url: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-[#0A0D14] text-[#FFF9F5]`}>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" theme="dark" />
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
