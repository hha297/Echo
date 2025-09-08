'use client';

import {
        BookOpenIcon,
        BotIcon,
        GemIcon,
        LayoutDashboardIcon,
        MicIcon,
        PaletteIcon,
        PhoneCallIcon,
        UsersIcon,
        type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useRouter } from 'next/navigation';

interface Feature {
        icon: LucideIcon;
        label: string;
        description: string;
}

interface PremiumFeatureOverlayProps {
        children: React.ReactNode;
}

const features: Feature[] = [
        {
                icon: BotIcon,
                label: 'AI Agents Support',
                description: 'Intelligent automated support 24/7',
        },
        {
                icon: MicIcon,
                label: 'Voice Assistant',
                description: 'Voice-enabled AI assistant for your customers',
        },
        {
                icon: PhoneCallIcon,
                label: 'Phone Support',
                description: 'Inbound & outbound calling capabilities',
        },
        {
                icon: BookOpenIcon,
                label: 'Knowledge Base',
                description: 'Train AI on your own documentation',
        },
        {
                icon: PaletteIcon,
                label: 'Widget Customization',
                description: 'Customize your widget with your own branding',
        },
        {
                icon: UsersIcon,
                label: 'Team Access',
                description: 'Invite up to 5 operators to collaborate on your organization',
        },
];

export const PremiumFeatureOverlay = ({ children }: PremiumFeatureOverlayProps) => {
        const router = useRouter();
        return (
                <Card className="relative min-h-screen">
                        {/* Blur overlay */}
                        <div className="pointer-events-none select-none blur-[2px]">{children}</div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

                        {/* Upgrade prompt */}
                        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                                <Card className="w-full max-w-md">
                                        <CardHeader className="text-center">
                                                <div className="flex items-center justify-center">
                                                        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                                                                <GemIcon className="size-6 text-muted-foreground" />
                                                        </div>
                                                </div>
                                                <CardTitle className="text-2xl font-bold">Upgrade to Pro</CardTitle>
                                                <CardDescription className="text-sm text-muted-foreground">
                                                        Get access to all features and unlimited storage.
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                                <div className="space-y-6">
                                                        {features.map((feature) => (
                                                                <div
                                                                        key={feature.label}
                                                                        className="flex items-center gap-3"
                                                                >
                                                                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                                                                                <feature.icon className="size-4 text-muted-foreground" />
                                                                        </div>
                                                                        <div className="text-left">
                                                                                <p className="text-sm font-medium">
                                                                                        {feature.label}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                        {feature.description}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                                <Button
                                                        className="w-full"
                                                        onClick={() => router.push('/billing')}
                                                        size={'lg'}
                                                >
                                                        Upgrade to Pro
                                                </Button>
                                        </CardContent>
                                </Card>
                        </div>
                </Card>
        );
};
