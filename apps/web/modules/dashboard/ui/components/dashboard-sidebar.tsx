'use client';

import { usePathname } from 'next/navigation';

import {
        Sidebar,
        SidebarContent,
        SidebarHeader,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuButton,
        SidebarGroup,
        SidebarGroupLabel,
        SidebarGroupContent,
        SidebarRail,
        SidebarFooter,
} from '@workspace/ui/components/sidebar';
import { CreditCardIcon, InboxIcon, LayoutDashboardIcon, LibraryBigIcon, MicIcon, PaletteIcon } from 'lucide-react';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const customerSupportItems = [
        {
                title: 'Conversations',
                url: '/conversations',
                icon: InboxIcon,
        },
        {
                title: 'Knowledge Base',
                url: '/files',
                icon: LibraryBigIcon,
        },
];

const configurationItems = [
        {
                title: 'Widget Customization',
                url: '/customization',
                icon: PaletteIcon,
        },
        {
                title: 'Integrations',
                url: '/integrations',
                icon: LayoutDashboardIcon,
        },
        {
                title: 'Voice Assistant',
                url: '/plugins/vapi',
                icon: MicIcon,
        },
];

const accountItems = [
        {
                title: 'Plans & Billing',
                url: '/billing',
                icon: CreditCardIcon,
        },
];

export const DashboardSidebar = () => {
        const pathname = usePathname();
        const isActive = (url: string) => {
                if (url === '/') {
                        return pathname === '/';
                }
                return pathname.startsWith(url);
        };
        return (
                <Sidebar className="group" collapsible="icon">
                        <SidebarHeader>
                                <SidebarMenu>
                                        <SidebarMenuItem>
                                                <SidebarMenuButton asChild size={'lg'}>
                                                        <OrganizationSwitcher
                                                                hidePersonal
                                                                skipInvitationScreen
                                                                appearance={{
                                                                        elements: {
                                                                                rootBox: 'w-full! h-8!',
                                                                                avatarBox: 'size-4! rounded-sm!',
                                                                                organizationSwitcherTrigger:
                                                                                        'w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                                                                                organizationSwitcherTriggerIcon:
                                                                                        'group-data-[collapsible=icon]:hidden! ml-auto! text-sm! text-sidebar-foreground!',
                                                                                organizationPreview:
                                                                                        'group-data-[collapsible=icon]:justify-center! gap-2!',
                                                                                organizationPreviewTextContainer:
                                                                                        'group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!',
                                                                        },
                                                                }}
                                                        />
                                                </SidebarMenuButton>
                                        </SidebarMenuItem>
                                </SidebarMenu>
                        </SidebarHeader>
                        <SidebarContent>
                                {/* Customer Support */}
                                <SidebarGroup>
                                        <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                                <SidebarMenu>
                                                        {customerSupportItems.map((item) => (
                                                                <SidebarMenuItem key={item.title}>
                                                                        <SidebarMenuButton
                                                                                asChild
                                                                                tooltip={item.title}
                                                                                isActive={isActive(item.url)}
                                                                        >
                                                                                <Link href={item.url}>
                                                                                        <item.icon className="h-5 w-5" />
                                                                                        {item.title}
                                                                                </Link>
                                                                        </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                        ))}
                                                </SidebarMenu>
                                        </SidebarGroupContent>
                                </SidebarGroup>

                                {/* Configuration */}
                                <SidebarGroup>
                                        <SidebarGroupLabel>Configurations</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                                <SidebarMenu>
                                                        {configurationItems.map((item) => (
                                                                <SidebarMenuItem key={item.title}>
                                                                        <SidebarMenuButton
                                                                                asChild
                                                                                tooltip={item.title}
                                                                                isActive={isActive(item.url)}
                                                                        >
                                                                                <Link href={item.url}>
                                                                                        <item.icon className="h-5 w-5" />
                                                                                        {item.title}
                                                                                </Link>
                                                                        </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                        ))}
                                                </SidebarMenu>
                                        </SidebarGroupContent>
                                </SidebarGroup>
                                {/* Account */}
                                <SidebarGroup>
                                        <SidebarGroupLabel>Accounts</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                                <SidebarMenu>
                                                        {accountItems.map((item) => (
                                                                <SidebarMenuItem key={item.title}>
                                                                        <SidebarMenuButton
                                                                                asChild
                                                                                tooltip={item.title}
                                                                                isActive={isActive(item.url)}
                                                                        >
                                                                                <Link href={item.url}>
                                                                                        <item.icon className="h-5 w-5" />
                                                                                        {item.title}
                                                                                </Link>
                                                                        </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                        ))}
                                                </SidebarMenu>
                                        </SidebarGroupContent>
                                </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                                <SidebarMenu>
                                        <SidebarMenuItem>
                                                <UserButton
                                                        showName
                                                        appearance={{
                                                                elements: {
                                                                        rootBox: 'w-full! h-8!',
                                                                        userButtonTrigger:
                                                                                'w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                                                                        userButtonBox:
                                                                                'w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!',
                                                                        userButtonOuterIdentifier:
                                                                                'pl-0! group-data-[collapsible=icon]:hidden',
                                                                        avatarBox: 'size-5!',
                                                                },
                                                        }}
                                                />
                                        </SidebarMenuItem>
                                </SidebarMenu>
                        </SidebarFooter>
                        <SidebarRail />
                </Sidebar>
        );
};
