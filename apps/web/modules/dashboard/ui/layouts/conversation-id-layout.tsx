import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable';
import { ContactPanel } from '../components/contact-panel';

export const ConversationIdLayout = ({ children }: { children: React.ReactNode }) => {
        return (
                <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
                        <ResizablePanel className="h-full" defaultSize={60}>
                                <div className="flex h-full flex-1 flex-col">{children}</div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel className="lg:block hidden" defaultSize={40} maxSize={40} minSize={20}>
                                <ContactPanel />
                        </ResizablePanel>
                </ResizablePanelGroup>
        );
};
