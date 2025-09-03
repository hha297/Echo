import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
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
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';
import { Doc } from '@workspace/backend/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Loader2Icon } from 'lucide-react';
import { VapiFormField } from './vapi-form-field';

export const widgetSettingsSchema = z.object({
        greetMessage: z.string().min(1, 'Greet message is required'),
        defaultSuggestions: z.object({
                suggestion1: z.string().optional(),
                suggestion2: z.string().optional(),
                suggestion3: z.string().optional(),
        }),
        vapiSettings: z.object({
                assistantId: z.string().optional(),
                phoneNumbers: z.string().optional(),
        }),
});
type WidgetSettings = Doc<'widgetSettings'>;
export type FormSchema = z.infer<typeof widgetSettingsSchema>;
interface CustomizationFormProps {
        initialData: WidgetSettings | null;
        hasVapiPlugin: boolean;
}

const CustomizationForm = ({ initialData, hasVapiPlugin }: CustomizationFormProps) => {
        const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

        const form = useForm<FormSchema>({
                resolver: zodResolver(widgetSettingsSchema),
                defaultValues: {
                        greetMessage: initialData?.greetMessage ?? 'Hi there! How can I help you today?',
                        defaultSuggestions: initialData?.defaultSuggestions ?? {
                                suggestion1:
                                        initialData?.defaultSuggestions?.suggestion1 ?? 'I need help with my account',
                                suggestion2:
                                        initialData?.defaultSuggestions?.suggestion2 ??
                                        'I have a question about the product',
                                suggestion3:
                                        initialData?.defaultSuggestions?.suggestion3 ??
                                        'I need to cancel my subscription',
                        },
                        vapiSettings: initialData?.vapiSettings ?? {
                                assistantId: initialData?.vapiSettings?.assistantId ?? '',
                                phoneNumbers: initialData?.vapiSettings?.phoneNumbers ?? '',
                        },
                },
        });

        const onSubmit = async (values: FormSchema) => {
                try {
                        const vapiSettings: WidgetSettings['vapiSettings'] = {
                                assistantId:
                                        values.vapiSettings.assistantId === 'none'
                                                ? ''
                                                : values.vapiSettings.assistantId,
                                phoneNumbers:
                                        values.vapiSettings.phoneNumbers === 'none'
                                                ? ''
                                                : values.vapiSettings.phoneNumbers,
                        };

                        await upsertWidgetSettings({
                                greetMessage: values.greetMessage,
                                defaultSuggestions: values.defaultSuggestions,
                                vapiSettings,
                        });

                        toast.success('Widget settings updated successfully');
                } catch (error) {
                        console.error(error);
                        toast.error('Failed to update widget settings');
                }
        };

        return (
                <Form {...form}>
                        <form className="flex flex-1 flex-col gap-y-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
                                <Card>
                                        <CardHeader>
                                                <CardTitle>General Chat Settings</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                                <FormField
                                                        control={form.control}
                                                        name="greetMessage"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Greeting Message</FormLabel>
                                                                        <FormControl>
                                                                                <Textarea
                                                                                        placeholder="e.g. Hi there! How can I help you today?"
                                                                                        {...field}
                                                                                        rows={3}
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                This is the message that will be shown
                                                                                when the user starts a new chat.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <Separator />
                                                <div className="space-y-4">
                                                        <div>
                                                                <h3>Default Suggestions</h3>
                                                                <p className="mb-4 text-muted-foreground text-sm">
                                                                        Quick reply suggestions that will be shown when
                                                                        the user starts a new chat. It will help the
                                                                        user to quickly select a suggestion.
                                                                </p>
                                                                <div className="space-y-4">
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="defaultSuggestions.suggestion1"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="e.g. How can I use the app?"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="defaultSuggestions.suggestion2"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="e.g. What are your pricing plans?"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="defaultSuggestions.suggestion3"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="e.g. I need help with my subscription"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                </div>
                                                        </div>
                                                </div>
                                        </CardContent>
                                </Card>
                                {hasVapiPlugin && (
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Voice Assistant Settings</CardTitle>
                                                        <CardDescription>
                                                                This is the settings for the voice assistant powered by
                                                                VAPI. You can configure the voice assistant to use a
                                                                specific assistant and phone numbers.
                                                        </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <VapiFormField
                                                                form={form}
                                                                disabled={form.formState.isSubmitting}
                                                        />
                                                </CardContent>
                                        </Card>
                                )}
                                <div className="flex items-center justify-end">
                                        <Button disabled={form.formState.isSubmitting} type="submit">
                                                {form.formState.isSubmitting ? (
                                                        <Loader2Icon className="animate-spin" />
                                                ) : (
                                                        'Save Settings'
                                                )}
                                        </Button>
                                </div>
                        </form>
                </Form>
        );
};

export default CustomizationForm;
