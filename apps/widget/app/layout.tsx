import { Space_Grotesk, Space_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { Providers } from '@/components/providers';

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
                                <Providers>{children}</Providers>
                        </body>
                </html>
        );
}
