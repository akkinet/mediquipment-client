import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import ClientProvider from "../components/ClientProvider";
import Footer from "../components/Footer";
import { getServerSession } from "next-auth/next";
import SessionProVider from "../components/SessionProVider";
import DataProvider from "../components/server/DataProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home",
  description: "Medical Equipment Commerce",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <>
      <html lang="en" className="">
        <body className={inter.className}>
          <SessionProVider session={session}>
            <DataProvider>
              <ClientProvider>
                <Navbar />
              </ClientProvider>
              {children}
              <ClientProvider>
                <Footer />
              </ClientProvider>
            </DataProvider>
          </SessionProVider>
        </body>
      </html>
    </>
  );
}
