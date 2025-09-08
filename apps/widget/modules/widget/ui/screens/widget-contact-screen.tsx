import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { WidgetHeader } from '../components/widget-header';
import { useAtomValue, useSetAtom } from 'jotai';
import { screenAtom, widgetSettingsAtom } from '../../atom/widget-atom';
import { useState } from 'react';
import Link from 'next/link';

export const WidgetContactScreen = () => {
        const setScreen = useSetAtom(screenAtom);
        const widgetSettings = useAtomValue(widgetSettingsAtom);

        const phoneNumber = widgetSettings?.vapiSettings?.phoneNumbers;

        const [copied, setCopied] = useState(false);

        const handleCopy = async () => {
                if (!phoneNumber) return;
                try {
                        await navigator.clipboard.writeText(phoneNumber);
                        setCopied(true);
                } catch (error) {
                        console.error('Failed to copy phone number', error);
                } finally {
                        setTimeout(() => {
                                setCopied(false);
                        }, 2000);
                }
        };
        return (
                <>
                        <WidgetHeader>
                                <div className="flex items-center gap-x-2">
                                        <Button
                                                variant={'transparent'}
                                                size={'icon'}
                                                onClick={() => setScreen('selection')}
                                        >
                                                <ArrowLeftIcon />
                                        </Button>
                                        <p>Contact Us</p>
                                </div>
                        </WidgetHeader>
                        <div className="flex h-full flex-col items-center justify-center gap-y-4">
                                <div className="flex items-center justify-center rounded-full border bg-white p-3">
                                        <PhoneIcon className="size-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">Available 24/7</p>
                                <p className="text-2xl text-muted-foreground font-bold">{phoneNumber}</p>
                        </div>
                        <div className="border-t bg-background p-4">
                                <div className="flex flex-col items-center gap-y-2">
                                        <Button onClick={handleCopy} size={'lg'} className="w-full">
                                                {copied ? (
                                                        <>
                                                                <CheckIcon className="size-4" />
                                                                Copied
                                                        </>
                                                ) : (
                                                        <>
                                                                <CopyIcon className="size-4" />
                                                                Copy
                                                        </>
                                                )}
                                        </Button>
                                        <Button asChild className="w-full" size={'lg'}>
                                                <Link href={`tel:${phoneNumber}`}>
                                                        <PhoneIcon className="size-4" />
                                                        Call Us
                                                </Link>
                                        </Button>
                                </div>
                        </div>
                </>
        );
};
