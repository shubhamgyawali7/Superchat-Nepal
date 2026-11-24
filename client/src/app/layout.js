import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Superchat Nepal",
  description: "Donation platform for Nepali streamers",
  icons: {
    icon: "/logo.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

