import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "BIOTACT | Priroda. Nauka. Poverenje.",
    template: "%s | BIOTACT",
  },
  description: "BIOTACT wellness podrška, informacije o aktivnim paketima i lični kontakt.",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "BIOTACT",
    title: "BIOTACT | Priroda. Nauka. Poverenje.",
    description: "Wellness podrška, proverene informacije i lični kontakt.",
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sr-Latn" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
