"use client";
import React from "react";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/lib/queryClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </body>
        </html>
    );
}
