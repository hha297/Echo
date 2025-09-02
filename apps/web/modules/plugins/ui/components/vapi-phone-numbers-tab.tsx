'use client';

import { CheckCircleIcon, PhoneIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@workspace/ui/components/badge';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { useVapiPhoneNumbers } from '../../hooks/use-vapi-data';

export const VapiPhoneNumbersTab = () => {
        const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();

        return (
                <div className="border-t bg-background">
                        <Table>
                                <TableHeader>
                                        <TableRow>
                                                <TableHead className="px-6 py-4">Phone Number</TableHead>
                                                <TableHead className="px-6 py-4">Name</TableHead>
                                                <TableHead className="px-6 py-4">Status</TableHead>
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
                                                                                Loading phone numbers...
                                                                        </TableCell>
                                                                </TableRow>
                                                        );
                                                }
                                                if (phoneNumbers?.length === 0) {
                                                        return (
                                                                <TableRow>
                                                                        <TableCell
                                                                                colSpan={3}
                                                                                className="px-6 py-8 text-center text-muted-foreground"
                                                                        >
                                                                                No phone numbers found
                                                                        </TableCell>
                                                                </TableRow>
                                                        );
                                                }
                                                return phoneNumbers?.map((phoneNumber) => (
                                                        <TableRow key={phoneNumber.id} className="hover:bg-muted/50">
                                                                <TableCell className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                                <PhoneIcon className="size-4" />
                                                                                <span>
                                                                                        {phoneNumber.number ||
                                                                                                'Not configured'}
                                                                                </span>
                                                                        </div>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-4">
                                                                        {phoneNumber.name || 'Not configured'}
                                                                </TableCell>
                                                                <TableCell className="px-6 py-4">
                                                                        <Badge
                                                                                variant={
                                                                                        phoneNumber.status === 'active'
                                                                                                ? 'default'
                                                                                                : 'destructive'
                                                                                }
                                                                        >
                                                                                {phoneNumber.status === 'active' && (
                                                                                        <CheckCircleIcon className="size-4" />
                                                                                )}
                                                                                {phoneNumber.status !== 'active' && (
                                                                                        <XCircleIcon className="size-4" />
                                                                                )}
                                                                                {phoneNumber.status || 'Unknown'}
                                                                        </Badge>
                                                                </TableCell>
                                                        </TableRow>
                                                ));
                                        })()}
                                </TableBody>
                        </Table>
                </div>
        );
};
