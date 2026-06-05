import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Latika Organics",
  description: "Organic Oils Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <Providers>

          {/* 🔥 TOAST SYSTEM (MANDATORY) */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "14px"
              }
            }}
          />

          <Navbar />

          {/* MAIN CONTENT */}
          <main style={{ paddingTop: "110px" }}>
            {children}
          </main>

        </Providers>

      </body>
    </html>
  );
}