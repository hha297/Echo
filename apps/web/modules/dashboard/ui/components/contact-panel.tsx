'use client';

import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { getCountryFlagUrl, getCountryFromTimeZone } from '@/lib/country-utils';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { ClockIcon, MailIcon, MapPinIcon, MonitorIcon } from 'lucide-react';
import Bowser from 'bowser';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { userAgent } from 'next/server';

type InfoItem = {
        label: string;
        value: string | React.ReactNode;
        className?: string;
};

type InfoSection = {
        id: string;
        icon: React.ComponentType<{ className?: string }>;
        title: string;
        items: InfoItem[];
};

export const ContactPanel = () => {
        const params = useParams();
        const conversationId = params.conversationId as Id<'conversation'> | null;

        const contactSession = useQuery(
                api.private.contactSessions.getOneByConversationId,
                conversationId
                        ? {
                                  conversationId,
                          }
                        : 'skip',
        );

        const parseUserAgent = useMemo(() => {
                return (userAgent?: string) => {
                        if (!userAgent) {
                                return {
                                        browser: 'Unknown',
                                        os: 'Unknown',
                                        device: 'Unknown',
                                };
                        }

                        const browser = Bowser.getParser(userAgent);
                        const result = browser.getResult();

                        return {
                                browser: result.browser.name || 'Unknown',
                                browserVersion: result.browser.version || 'Unknown',
                                os: result.os.name || 'Unknown',
                                osVersion: result.os.version || 'Unknown',
                                device: result.platform.type || 'desktop',
                                deviceVendor: result.platform.vendor || 'Unknown',
                                deviceModel: result.platform.model || 'Unknown',
                        };
                };
        }, []);

        const userAgentInfo = useMemo(() => {
                return parseUserAgent(contactSession?.metadata?.userAgent);
        }, [contactSession, parseUserAgent]);

        const countryInfo = useMemo(() => {
                return getCountryFromTimeZone(contactSession?.metadata?.timezone);
        }, [contactSession]);

        const accordionSections = useMemo<InfoSection[]>(() => {
                if (!contactSession?.metadata) {
                        return [];
                }

                return [
                        {
                                id: 'device-info',
                                icon: MonitorIcon,
                                title: 'Device Information',
                                items: [
                                        {
                                                label: 'Browser',
                                                value:
                                                        userAgentInfo.browser +
                                                        (userAgentInfo.browserVersion
                                                                ? ` ${userAgentInfo.browserVersion}`
                                                                : ''),
                                        },
                                        {
                                                label: 'OS',
                                                value:
                                                        userAgentInfo.os +
                                                        (userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ''),
                                        },
                                        {
                                                label: 'Device',
                                                value:
                                                        userAgentInfo.device +
                                                        (userAgentInfo.deviceModel
                                                                ? ` - ${userAgentInfo.deviceModel}`
                                                                : 'Unknown'),
                                                className: 'capitalize',
                                        },
                                        {
                                                label: 'Screen',
                                                value: contactSession.metadata.screenResolution,
                                        },
                                        {
                                                label: 'Viewport',
                                                value: contactSession.metadata.viewportSize,
                                        },
                                        {
                                                label: 'Cookie Enabled',
                                                value: contactSession.metadata.cookieEnabled ? 'Enabled' : 'Disabled',
                                        },
                                ],
                        },
                        {
                                id: 'location-info',
                                icon: MapPinIcon,
                                title: 'Location Information',
                                items: [
                                        ...(countryInfo
                                                ? [
                                                          {
                                                                  label: 'Country',
                                                                  value: (
                                                                          <span>
                                                                                  <img
                                                                                          src={getCountryFlagUrl(
                                                                                                  countryInfo.code ||
                                                                                                          '',
                                                                                          )}
                                                                                          alt={countryInfo.name}
                                                                                          width={20}
                                                                                          height={20}
                                                                                          style={{
                                                                                                  display: 'inline',
                                                                                                  verticalAlign:
                                                                                                          'middle',
                                                                                                  marginRight: 6,
                                                                                          }}
                                                                                  />
                                                                                  {countryInfo.name}
                                                                          </span>
                                                                  ),
                                                          },
                                                  ]
                                                : []),
                                        {
                                                label: 'Language',
                                                value: contactSession.metadata.language,
                                        },
                                        {
                                                label: 'Timezone',
                                                value: contactSession.metadata.timezone,
                                        },
                                        {
                                                label: 'UTC Offset',
                                                value:
                                                        contactSession.metadata.timezoneOffset !== undefined
                                                                ? `${-contactSession.metadata.timezoneOffset / 60} hours`
                                                                : 'Unknown',
                                        },
                                ],
                        },
                        {
                                id: 'section-info',
                                icon: ClockIcon,
                                title: 'Section Information',
                                items: [
                                        {
                                                label: 'Section Started',
                                                value: new Date(contactSession._creationTime).toLocaleString(),
                                        },
                                ],
                        },
                ];
        }, [userAgentInfo, countryInfo, contactSession]);

        if (contactSession === undefined || contactSession === null) {
                return null;
        }

        return (
                <div className="flex h-full w-full flex-col bg-background text-foreground">
                        <div className="flex flex-col gap-y-4 p-4">
                                <div className="flex items-center gap-x-2">
                                        <DicebearAvatar
                                                size={40}
                                                badgeImageUrl={
                                                        countryInfo?.code
                                                                ? getCountryFlagUrl(countryInfo.code)
                                                                : undefined
                                                }
                                                seed={contactSession._id}
                                        />
                                        <div className="flex-1 overflow-hidden">
                                                <div className="flex items-center gap-x-2">
                                                        <h4 className="line-clamp-1">{contactSession.name}</h4>
                                                </div>
                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                        {contactSession.email}
                                                </p>
                                        </div>
                                </div>
                                <Button asChild className="w-full" size={'lg'}>
                                        <Link href={`mailto:${contactSession.email}`}>
                                                <MailIcon />
                                                <span>Send Email</span>
                                        </Link>
                                </Button>
                        </div>
                        <div>
                                {contactSession?.metadata && (
                                        <Accordion type="single" collapsible className="w-full rounded-none border-y">
                                                {accordionSections.map((section) => (
                                                        <AccordionItem
                                                                key={section.id}
                                                                value={section.id}
                                                                className="rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]"
                                                        >
                                                                <AccordionTrigger className="flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50">
                                                                        <div className="flex items-center gap-4">
                                                                                <section.icon className="size-4 shrink-0" />
                                                                                <span>{section.title}</span>
                                                                        </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="px-5 py-4">
                                                                        <div className="space-y-2 text-sm">
                                                                                {section.items.map((item) => (
                                                                                        <div
                                                                                                key={`${section.id}-${item.label}`}
                                                                                                className="flex items-center justify-between"
                                                                                        >
                                                                                                <span className="text-muted-foreground">
                                                                                                        {item.label}
                                                                                                </span>
                                                                                                <span
                                                                                                        className={
                                                                                                                item.className
                                                                                                        }
                                                                                                >
                                                                                                        {item.value}
                                                                                                </span>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </AccordionContent>
                                                        </AccordionItem>
                                                ))}
                                        </Accordion>
                                )}
                        </div>
                </div>
        );
};
