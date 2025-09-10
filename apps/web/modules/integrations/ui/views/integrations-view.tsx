'use client';

import { useOrganization } from '@clerk/nextjs';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { IntegrationId, INTEGRATIONS } from '../../constants';
import Image from 'next/image';
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from '@workspace/ui/components/dialog';
import { createScript } from '../../utils';

const IntegrationsView = () => {
        const { organization } = useOrganization();
        const [isCopied, setIsCopied] = useState(false);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [selectedSnippet, setSelectedSnippet] = useState('');

        const handleIntegrationClick = (integrationId: IntegrationId) => {
                if (!organization) {
                        toast.error('Organization not found');
                        return;
                }
                const snippet = createScript(integrationId, organization.id);
                setSelectedSnippet(snippet);
                setDialogOpen(true);
        };
        const handleCopy = () => {
                try {
                        navigator.clipboard.writeText(organization?.id || '');
                        toast.success('Organization ID copied to clipboard');
                        setIsCopied(true);
                        setTimeout(() => {
                                setIsCopied(false);
                        }, 2000);
                } catch (error) {
                        toast.error('Failed to copy organization ID');
                }
        };
        return (
                <>
                        <IntergrationDialog open={dialogOpen} onOpenChange={setDialogOpen} snippet={selectedSnippet} />
                        <div className="flex min-h-screen flex-col bg-muted p-8">
                                <div className="mx-auto w-full max-w-screen-md">
                                        <div className="flex flex-col gap-4">
                                                <h1 className="text-2xl md:text-4xl font-bold">Setup & Integrations</h1>
                                                <p>
                                                        Setup and integrate your favorite tools to enhance your customer
                                                        support
                                                </p>
                                        </div>
                                        <div className="mt-8 space-y-6">
                                                <div className="flex items-center gap-4">
                                                        <Label className="w-32" htmlFor="organization-id">
                                                                Organization ID
                                                        </Label>
                                                        <Input
                                                                disabled
                                                                readOnly
                                                                id="organization-id"
                                                                className="flex-1 bg-background text-sm"
                                                                value={organization?.id || ''}
                                                        />
                                                        <Button size="sm" onClick={handleCopy}>
                                                                {isCopied ? (
                                                                        <CheckIcon className="size-4" />
                                                                ) : (
                                                                        <CopyIcon
                                                                                className={cn(
                                                                                        'size-4',
                                                                                        isCopied && 'animate-pulse',
                                                                                )}
                                                                        />
                                                                )}
                                                                {isCopied ? 'Copied' : 'Copy'}
                                                        </Button>
                                                </div>
                                        </div>
                                        <Separator className="my-8" />
                                        <div className="space-y-6">
                                                <div className="space-y-1">
                                                        <Label className="text-lg font-medium">Integrations</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                                Add the following code to your website to enable chatbot
                                                        </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                        {INTEGRATIONS.map((integration) => (
                                                                <button
                                                                        className="flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
                                                                        key={integration.title}
                                                                        onClick={() => {
                                                                                handleIntegrationClick(integration.id);
                                                                        }}
                                                                        type="button"
                                                                >
                                                                        <Image
                                                                                src={integration.icon}
                                                                                alt={integration.title}
                                                                                width={40}
                                                                                height={40}
                                                                        />
                                                                        <p>{integration.title}</p>
                                                                </button>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>
                </>
        );
};

export default IntegrationsView;

export const IntergrationDialog = ({
        open,
        onOpenChange,
        snippet,
}: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        snippet: string;
}) => {
        const [isCopied, setIsCopied] = useState(false);
        const handleCopy = () => {
                try {
                        navigator.clipboard.writeText(snippet || '');
                        toast.success('Snippet copied to clipboard');
                        setIsCopied(true);
                        setTimeout(() => {
                                setIsCopied(false);
                        }, 2000);
                } catch (error) {
                        toast.error('Failed to copy organization ID');
                }
        };
        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Integration with your website</DialogTitle>
                                        <DialogDescription>
                                                Follow the instructions to integrate chatbot to your website
                                        </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                        <div className="space-y-2">
                                                <div className="rounded-md bg-accent p-2 text-sm">
                                                        1. Copy the following code to your website
                                                </div>
                                                <div className="group relative">
                                                        <pre className="max-h-[300px] overflow-y-auto overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 text-secondary text-sm">
                                                                {snippet}
                                                        </pre>
                                                        <Button
                                                                className="absolute top-1 right-1 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                                onClick={handleCopy}
                                                                size={'icon'}
                                                                variant={'secondary'}
                                                        >
                                                                {isCopied ? (
                                                                        <CheckIcon className="size-4" />
                                                                ) : (
                                                                        <CopyIcon className="size-4" />
                                                                )}
                                                        </Button>
                                                </div>
                                        </div>
                                        <div className="space-y-2">
                                                <div className="rounded-md bg-accent p-2 text-sm">
                                                        2. Add the following code to your website
                                                </div>
                                                <p>
                                                        Paste the chatbox code above in your page. You can add it in the
                                                        HTML head section
                                                </p>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};
