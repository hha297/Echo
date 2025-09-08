import { Space_Grotesk, Space_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/components/providers';
import { Toaster } from '@workspace/ui/components/sonner';
const fontPrimary = Space_Grotesk({
        subsets: ['latin'],
        weight: ['300', '400', '500', '600', '700'],
        variable: '--font-primary',
});

const fontSecondary = Space_Mono({
        subsets: ['latin'],
        weight: ['400', '700'],
        variable: '--font-secondary',
});

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <html lang="en" suppressHydrationWarning>
                        <body className={`${fontPrimary.variable} ${fontSecondary.variable} font-primary antialiased`}>
                                <ClerkProvider
                                        appearance={{
                                                variables: {
                                                        colorPrimary: '#3C82F6',
                                                },
                                        }}
                                >
                                        <ConvexClientProvider>
                                                <Toaster />
                                                {children}
                                        </ConvexClientProvider>
                                </ClerkProvider>
                        </body>
                </html>
        );
}
