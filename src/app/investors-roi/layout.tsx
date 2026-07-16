import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./investors-roi.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "SLB Investor ROI | Softwood Lumber Board",
  description:
    "Investor-facing view of Softwood Lumber Board program impact and return on investment.",
};

export default function InvestorsRoiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`investors-roi min-h-screen ${openSans.variable}`}>
      {children}
    </div>
  );
}
