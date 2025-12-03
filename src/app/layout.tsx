import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import StoreProvider from "@/store/StoreProvider";
import type { Metadata } from "next";
import "@/assets/global.css";
import QueryClientProvider from "@/components/QueryClientProvider";

export const metadata: Metadata = {
  title: "Reservation App",
  description: "Reservation App",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryClientProvider>
            <StoreProvider>
              <Header />
              {children}
            </StoreProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
