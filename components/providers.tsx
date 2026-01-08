"use client";

import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import RouteChangeTracker from "@/components/route-change-tracker";

import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <Suspense fallback={null}>
                    <RouteChangeTracker />
                </Suspense>
                {children}
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
    );
}
