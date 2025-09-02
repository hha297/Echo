'use client';

import { BotIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { useVapiAssistants } from '../../hooks/use-vapi-data';

export const VapiAssistantsTab = () => {
        const { data: assistants, isLoading } = useVapiAssistants();

        const copyToClipboard = async (text: string) => {
                try {
                        await navigator.clipboard.writeText(text);
                        toast.success('Copied to clipboard');
                } catch (error) {
                        toast.error('Failed to copy to clipboard');
                }
        };
        return (
                <div className="border-t bg-background">
                        <Table>
                                <TableHeader>
                                        <TableRow>
                                                <TableHead className="px-6 py-4">Assistant</TableHead>
                                                <TableHead className="px-6 py-4">Model</TableHead>
                                                <TableHead className="px-6 py-4 text-center">First Message</TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                        {(() => {
                                                if (isLoading) {
                                                        return (
                                                                <TableRow>
                                                                        <TableCell
                                                                                colSpan={3}
                                                                                className="px-6 py-8 text-center text-muted-foreground"
                                                                        >
                                                                                Loading assistants...
                                                                        </TableCell>
                                                                </TableRow>
                                                        );
                                                }
                                                if (assistants?.length === 0) {
                                                        return (
                                                                <TableRow>
                                                                        <TableCell
                                                                                colSpan={3}
                                                                                className="px-6 py-8 text-center text-muted-foreground"
                                                                        >
                                                                                No assistants found
                                                                        </TableCell>
                                                                </TableRow>
                                                        );
                                                }
                                                return assistants.map((assistant) => (
                                                        <TableRow key={assistant.id} className="hover:bg-muted/50">
                                                                <TableCell className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                                <BotIcon className="size-4" />
                                                                                <span>
                                                                                        {assistant.name || 'Unname'}
                                                                                </span>
                                                                        </div>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-4">
                                                                        <span className="text-sm">
                                                                                {assistant.model?.model ||
                                                                                        'Not configured'}
                                                                        </span>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-4  max-w-xs">
                                                                        <p className="truncate text-sm text-muted-foreground">
                                                                                {assistant.firstMessage ||
                                                                                        'No greeting message configured'}
                                                                        </p>
                                                                </TableCell>
                                                        </TableRow>
                                                ));
                                        })()}
                                </TableBody>
                        </Table>
                </div>
        );
};
