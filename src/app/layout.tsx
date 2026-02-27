import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Todo",
  description: "Keep your family organized and on top of things together",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-stone-800 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
