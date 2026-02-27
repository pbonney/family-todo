"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fffbeb",
            color: "#292524",
            border: "1px solid #fde68a",
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}
