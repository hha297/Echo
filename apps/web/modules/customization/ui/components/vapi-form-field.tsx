import z from 'zod';
import type { FormSchema } from './customization-form';
import { UseFormReturn } from 'react-hook-form';
import { useVapiAssistants, useVapiPhoneNumbers } from '@/modules/plugins/hooks/use-vapi-data';
import {
        Form,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
} from '@workspace/ui/components/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';

interface VapiFormFieldProps {
        form: UseFormReturn<FormSchema>;
        disabled?: boolean;
}

export const VapiFormField = ({ form, disabled }: VapiFormFieldProps) => {
        const { data: assistants, isLoading: isLoadingAssistants } = useVapiAssistants();
        const { data: phoneNumbers, isLoading: isLoadingPhoneNumbers } = useVapiPhoneNumbers();

        return (
                <>
                        <FormField
                                control={form.control}
                                name="vapiSettings.assistantId"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Assistant</FormLabel>

                                                <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={disabled || isLoadingAssistants}
                                                >
                                                        <FormControl>
                                                                <SelectTrigger>
                                                                        <SelectValue
                                                                                placeholder={
                                                                                        isLoadingAssistants
                                                                                                ? 'Loading assistants...'
                                                                                                : 'Select an assistant'
                                                                                }
                                                                        />
                                                                </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                                <SelectItem value="none">None</SelectItem>
                                                                {assistants?.map((assistant) => (
                                                                        <SelectItem
                                                                                key={assistant.id}
                                                                                value={assistant.id}
                                                                        >
                                                                                {assistant.name || 'Unknown Assistant'}{' '}
                                                                                -{' '}
                                                                                {assistant.model?.model ||
                                                                                        'Unknown Model'}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                        This is the assistant that will be used to power the voice
                                                        assistant.
                                                </FormDescription>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />
                        <FormField
                                control={form.control}
                                name="vapiSettings.phoneNumbers"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={disabled || isLoadingPhoneNumbers}
                                                >
                                                        <FormControl>
                                                                <SelectTrigger>
                                                                        <SelectValue
                                                                                placeholder={
                                                                                        isLoadingPhoneNumbers
                                                                                                ? 'Loading phone numbers...'
                                                                                                : 'Select a phone number'
                                                                                }
                                                                        />
                                                                </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                                <SelectItem value="none">None</SelectItem>
                                                                {phoneNumbers?.map((phoneNumber) => (
                                                                        <SelectItem
                                                                                key={phoneNumber.id}
                                                                                value={phoneNumber.id}
                                                                        >
                                                                                {phoneNumber.number ||
                                                                                        'Unknown Phone Number'}{' '}
                                                                                - {phoneNumber.name || 'Unknown Name'}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                        Phone numbers are the phone numbers that will be used to power
                                                        the voice assistant. You can select multiple phone numbers.
                                                </FormDescription>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />
                </>
        );
};
