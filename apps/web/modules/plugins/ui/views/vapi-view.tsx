'use client';

import { GlobeIcon, Loader2, PhoneCallIcon, PhoneIcon, WorkflowIcon } from 'lucide-react';
import { type Feature, PluginCard } from '../components/plugin-card';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { useState } from 'react';
import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from '@workspace/ui/components/dialog';

import {
        Form,
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormDescription,
        FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const vapiFeatures: Feature[] = [
        {
                icon: GlobeIcon,
                label: 'Web Voice Calls',
                description: 'Make and receive voice calls directly in your browser',
        },
        {
                icon: PhoneIcon,
                label: 'Phone Numbers',
                description: 'Get dedicated phone numbers for your business',
        },
        {
                icon: PhoneCallIcon,
                label: 'Outbound Calls',
                description: 'Automatically make outbound calls to your customers',
        },
        {
                icon: WorkflowIcon,
                label: 'Workflows',
                description: 'Create and automate your workflows',
        },
];

const formSchema = z.object({
        publicApiKey: z.string().min(1),
        privateApiKey: z.string().min(1),
});
const VapiPluginForm = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
        const upsertSecret = useMutation(api.private.secrets.upsert);
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        publicApiKey: '',
                        privateApiKey: '',
                },
        });
        const onSubmit = async (values: z.infer<typeof formSchema>) => {
                try {
                        await upsertSecret({
                                service: 'vapi',
                                value: values,
                        });
                        toast.success('Vapi connected successfully.');
                        setOpen(false);
                } catch (error) {
                        toast.error('Failed to connect Vapi. Please try again.');
                        console.error(error);
                }
        };
        return (
                <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Connect Vapi</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                        Your API Keys are safely encrypted and stored in our database using AWS Secrets
                                        Manager.
                                </DialogDescription>
                                <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                <FormField
                                                        control={form.control}
                                                        name="publicApiKey"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Public API Key</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        {...field}
                                                                                        placeholder="Public API Key"
                                                                                        type="password"
                                                                                />
                                                                        </FormControl>
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="privateApiKey"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Private API Key</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        {...field}
                                                                                        placeholder="Private API Key"
                                                                                        type="password"
                                                                                />
                                                                        </FormControl>
                                                                </FormItem>
                                                        )}
                                                />
                                                <DialogFooter>
                                                        <Button disabled={form.formState.isSubmitting} type="submit">
                                                                {form.formState.isSubmitting ? (
                                                                        <div className="flex items-center gap-2">
                                                                                {' '}
                                                                                <Loader2 className="w-4 h-4 animate-spin" />{' '}
                                                                                Connecting...
                                                                        </div>
                                                                ) : (
                                                                        'Connect'
                                                                )}
                                                        </Button>
                                                </DialogFooter>
                                        </form>
                                </Form>
                        </DialogContent>
                </Dialog>
        );
};
const VapiView = () => {
        const vapiPlugin = useQuery(api.private.plugins.getOne, { service: 'vapi' });
        const [connectOpen, setConnectOpen] = useState(false);
        const [removeOpen, setRemoveOpen] = useState(false);
        const handleSubmit = () => {
                if (vapiPlugin) {
                        setRemoveOpen(true);
                } else {
                        setConnectOpen(true);
                }
        };
        return (
                <>
                        <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
                        <div className="flex min-h-screen flex-col bg-muted p-8">
                                <div className="mx-auto w-full max-w-screen-md">
                                        <div className="flex flex-col gap-4">
                                                <h1 className="text-2xl md:text-4xl font-bold">Vapi Plugin</h1>
                                                <p>Connect Vapi to enable seamless AI integration</p>
                                        </div>

                                        <div className="mt-8">
                                                {vapiPlugin ? (
                                                        <div>
                                                                <p>Vapi Plugin</p>
                                                        </div>
                                                ) : (
                                                        <PluginCard
                                                                serviceName="Vapi"
                                                                serviceImage="/vapi.jpg"
                                                                features={vapiFeatures}
                                                                onSubmit={handleSubmit}
                                                                isDisabled={vapiPlugin === undefined}
                                                        />
                                                )}
                                        </div>
                                </div>
                        </div>
                </>
        );
};

export default VapiView;
