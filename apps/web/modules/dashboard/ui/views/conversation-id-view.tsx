'use client';
import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { Button } from '@workspace/ui/components/button';
import { useAction, useMutation, useQuery } from 'convex/react';
import { MoreHorizontalIcon, Wand2Icon } from 'lucide-react';
import {
        AIConversation,
        AIConversationContent,
        AIConversationScrollButton,
} from '@workspace/ui/components/ai/conversation';
import { AIResponse } from '@workspace/ui/components/ai/response';
import { AIMessage, AIMessageContent } from '@workspace/ui/components/ai/message';
import {
        AIInput,
        AIInputButton,
        AIInputSubmit,
        AIInputTextarea,
        AIInputToolbar,
        AIInputTools,
} from '@workspace/ui/components/ai/input';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@workspace/ui/components/form';
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react';
import { DicebearAvatar } from '@workspace/ui/components/dicebear-avatar';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { ConversationStatusButton } from '../components/conversation-status-button';
import { useState } from 'react';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
        message: z.string().min(1, 'Message is required'),
});

export const ConversationIdView = ({ conversationId }: { conversationId: Id<'conversation'> }) => {
        const conversation = useQuery(api.private.conversation.getOne, { conversationId });
        const messages = useThreadMessages(
                api.private.messages.getMany,
                conversation?.threadId ? { threadId: conversation.threadId } : 'skip',
                { initialNumItems: 10 },
        );

        const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
                status: messages.status,
                loadMore: messages.loadMore,
                loadSize: 10,
                observerEnabled: false,
        });

        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        message: '',
                },
        });

        const enhanceMessage = useAction(api.private.messages.enhanceResponse);
        const handleEnhanceMessage = async () => {
                const currentMessage = form.getValues('message');
                setIsEnhancing(true);
                try {
                        const response = await enhanceMessage({
                                prompt: currentMessage,
                        });
                        form.setValue('message', response);
                } catch (error) {
                        console.error(error);
                        toast.error('Failed to enhance message');
                } finally {
                        setIsEnhancing(false);
                }
        };
        const [isEnhancing, setIsEnhancing] = useState(false);

        const createMessage = useMutation(api.private.messages.create);
        const onSubmit = async (values: z.infer<typeof formSchema>) => {
                try {
                        await createMessage({
                                conversationId,

                                prompt: values.message,
                        });
                        form.reset();
                } catch (error) {
                        console.log(error);
                }
        };

        const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
        const updateStatus = useMutation(api.private.conversation.updateStatus);
        const handleToggleStatus = async () => {
                if (!conversation) {
                        return;
                }

                setIsUpdatingStatus(true);

                let newStatus: 'unresolved' | 'escalated' | 'resolved';

                if (conversation.status === 'unresolved') {
                        newStatus = 'escalated';
                } else if (conversation.status === 'escalated') {
                        newStatus = 'resolved';
                } else {
                        newStatus = 'unresolved';
                }

                try {
                        await updateStatus({ conversationId, status: newStatus });
                } catch (error) {
                        console.error(error);
                } finally {
                        setIsUpdatingStatus(false);
                }
        };
        if (conversation === undefined || messages.status === 'LoadingFirstPage') {
                return <ConversationIdViewSkeleton />;
        }
        return (
                <div className="flex h-full flex-col bg-muted">
                        <header className="flex items-center justify-between border-b bg-background p-2.5">
                                <Button size={'sm'} variant={'ghost'}>
                                        <MoreHorizontalIcon />
                                </Button>
                                {conversation && (
                                        <ConversationStatusButton
                                                status={conversation.status}
                                                onClick={handleToggleStatus}
                                                disabled={isUpdatingStatus}
                                        />
                                )}
                        </header>
                        <AIConversation className="max-h-[calc(100vh-180px)]">
                                <AIConversationContent>
                                        <InfiniteScrollTrigger
                                                ref={topElementRef}
                                                canLoadMore={canLoadMore}
                                                isLoadingMore={isLoadingMore}
                                                onLoadMore={handleLoadMore}
                                        />
                                        {toUIMessages(messages.results ?? []).map((message) => (
                                                <AIMessage
                                                        from={message.role === 'user' ? 'assistant' : 'user'}
                                                        key={message.id}
                                                >
                                                        <AIMessageContent>
                                                                <AIResponse>{(message as any).content}</AIResponse>
                                                        </AIMessageContent>
                                                        {message.role === 'user' && (
                                                                <DicebearAvatar
                                                                        seed={conversation?.contactSessionId ?? 'user'}
                                                                        size={32}
                                                                />
                                                        )}
                                                </AIMessage>
                                        ))}
                                </AIConversationContent>
                                <AIConversationScrollButton />
                        </AIConversation>
                        <div className="p-2">
                                <Form {...form}>
                                        <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                                                <FormField
                                                        control={form.control}
                                                        disabled={conversation?.status === 'resolved'}
                                                        name="message"
                                                        render={({ field }) => (
                                                                <AIInputTextarea
                                                                        disabled={
                                                                                conversation?.status === 'resolved' ||
                                                                                form.formState.isSubmitting ||
                                                                                isEnhancing
                                                                        }
                                                                        onChange={field.onChange}
                                                                        onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                                        e.preventDefault();
                                                                                        form.handleSubmit(onSubmit)();
                                                                                }
                                                                        }}
                                                                        placeholder={
                                                                                conversation?.status === 'resolved'
                                                                                        ? 'This conversation has been resolved'
                                                                                        : 'Type your response as an operator...'
                                                                        }
                                                                        value={field.value}
                                                                />
                                                        )}
                                                />
                                                <AIInputToolbar>
                                                        <AIInputTools>
                                                                <AIInputButton
                                                                        disabled={
                                                                                isUpdatingStatus ||
                                                                                isEnhancing ||
                                                                                form.formState.isSubmitting ||
                                                                                !form.formState.isValid ||
                                                                                conversation?.status === 'resolved'
                                                                        }
                                                                        onClick={handleEnhanceMessage}
                                                                >
                                                                        <Wand2Icon />
                                                                        {isEnhancing ? 'Enhancing...' : 'Enhance'}
                                                                </AIInputButton>
                                                        </AIInputTools>
                                                        <AIInputSubmit
                                                                disabled={
                                                                        isUpdatingStatus ||
                                                                        conversation?.status === 'resolved' ||
                                                                        form.formState.isSubmitting ||
                                                                        form.formState.isValid ||
                                                                        isEnhancing
                                                                }
                                                                status="ready"
                                                                type="submit"
                                                        />
                                                </AIInputToolbar>
                                        </AIInput>
                                </Form>
                        </div>
                </div>
        );
};

export const ConversationIdViewSkeleton = () => {
        return (
                <div className="flex h-full flex-col bg-muted">
                        <header className="flex items-center justify-between border-b bg-background p-2.5">
                                <Button size={'sm'} variant={'ghost'}>
                                        <MoreHorizontalIcon />
                                </Button>
                        </header>
                        <AIConversation className="max-h-[calc(100vh-180px)]">
                                <AIConversationContent>
                                        {Array.from({ length: 10 }).map((_, index) => {
                                                const isUser = index % 2 === 0;
                                                const widths = ['w-48', 'w-60', 'w-72'];
                                                const width = widths[index % widths.length];
                                                return (
                                                        <div
                                                                className={cn(
                                                                        'group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]',
                                                                        isUser
                                                                                ? 'is-user'
                                                                                : 'is-assistant flex-row-reverse',
                                                                )}
                                                                key={index}
                                                        >
                                                                <Skeleton className={`h-9 ${width}`} />
                                                                <Skeleton className="size-8 rounded-full bg-neutral-200" />
                                                        </div>
                                                );
                                        })}
                                </AIConversationContent>
                        </AIConversation>
                        <div className="p-2">
                                <AIInput>
                                        <AIInputTextarea disabled placeholder="Type your response as an operator..." />
                                        <AIInputToolbar>
                                                <AIInputTools />
                                                <AIInputSubmit disabled status="ready" />
                                        </AIInputToolbar>
                                </AIInput>
                        </div>
                </div>
        );
};
