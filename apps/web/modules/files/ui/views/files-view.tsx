'use client';

import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import type { PublicFile } from '@workspace/backend/private/files';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { UploadDialog } from '../components/upload-dialog';
import { useState } from 'react';
import { DeleteFileDialog } from '../components/delete-file-dialog';

const FilesView = () => {
        const files = usePaginatedQuery(
                api.private.files.list,
                {},
                {
                        initialNumItems: 10,
                },
        );

        const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore, isLoadingFirstPage } = useInfiniteScroll({
                status: files.status,
                loadMore: files.loadMore,
                loadSize: 10,
        });

        const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

        const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
        const handleDeleteClick = (file: PublicFile) => {
                setSelectedFile(file);
                setDeleteDialogOpen(true);
        };

        const handleFileDeleted = () => {
                setSelectedFile(null);
        };

        return (
                <>
                        <DeleteFileDialog
                                open={deleteDialogOpen}
                                onOpenChange={setDeleteDialogOpen}
                                file={selectedFile}
                                onDelete={handleFileDeleted}
                        />
                        <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
                        <div className="flex min-h-screen flex-col bg-muted p-8">
                                <div className="mx-auto max-w-screen-md w-full">
                                        <div className="space-y-2">
                                                <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
                                                <p className="text-muted-foreground">
                                                        Add your documentation files to your knowledge base to improve
                                                        your agent's performance.
                                                </p>
                                        </div>

                                        <div className="mt-8 rounded-lg border bg-background">
                                                <div className="flex items-center justify-end border-b px-6 py-4">
                                                        <Button
                                                                variant="outline"
                                                                onClick={() => setUploadDialogOpen(true)}
                                                        >
                                                                <PlusIcon />
                                                                Add New File
                                                        </Button>
                                                </div>
                                        </div>

                                        <Table className="mt-4">
                                                <TableHeader>
                                                        <TableRow>
                                                                <TableHead className="px-6 py-4 font-medium">
                                                                        Name
                                                                </TableHead>
                                                                <TableHead className="px-6 py-4 font-medium">
                                                                        Type
                                                                </TableHead>
                                                                <TableHead className="px-6 py-4 font-medium">
                                                                        Size
                                                                </TableHead>
                                                                <TableHead className="px-6 py-4 font-medium">
                                                                        Action
                                                                </TableHead>
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {(() => {
                                                                if (isLoadingFirstPage) {
                                                                        return (
                                                                                <TableRow>
                                                                                        <TableCell
                                                                                                colSpan={4}
                                                                                                className="h-24 text-center"
                                                                                        >
                                                                                                Loading...
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        );
                                                                }

                                                                if (files.results.length === 0) {
                                                                        return (
                                                                                <TableRow>
                                                                                        <TableCell
                                                                                                colSpan={4}
                                                                                                className="h-24 text-center"
                                                                                        >
                                                                                                No files found
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        );
                                                                }

                                                                return files.results.map((file) => (
                                                                        <TableRow
                                                                                className="hover:bg-muted/50"
                                                                                key={file.id}
                                                                        >
                                                                                <TableCell className="px-6 py-4">
                                                                                        <div className="flex items-center gap-3">
                                                                                                <FileIcon />
                                                                                                {file.name}
                                                                                        </div>
                                                                                </TableCell>
                                                                                <TableCell className="px-6 py-4">
                                                                                        <Badge
                                                                                                className="uppercase"
                                                                                                variant={'outline'}
                                                                                        >
                                                                                                {file.type}
                                                                                        </Badge>
                                                                                </TableCell>
                                                                                <TableCell className="px-6 py-4">
                                                                                        {file.size}
                                                                                </TableCell>
                                                                                <TableCell className="px-6 py-4">
                                                                                        <DropdownMenu>
                                                                                                <DropdownMenuTrigger
                                                                                                        asChild
                                                                                                >
                                                                                                        <Button
                                                                                                                className="size-8 p-0"
                                                                                                                size={
                                                                                                                        'sm'
                                                                                                                }
                                                                                                                variant={
                                                                                                                        'ghost'
                                                                                                                }
                                                                                                        >
                                                                                                                <MoreHorizontalIcon />
                                                                                                        </Button>
                                                                                                </DropdownMenuTrigger>
                                                                                                <DropdownMenuContent align="end">
                                                                                                        <DropdownMenuItem
                                                                                                                onClick={() =>
                                                                                                                        handleDeleteClick(
                                                                                                                                file,
                                                                                                                        )
                                                                                                                }
                                                                                                                className="text-destructive cursor-pointer"
                                                                                                        >
                                                                                                                <TrashIcon className="mr-2 size-4 " />
                                                                                                                Delete
                                                                                                        </DropdownMenuItem>
                                                                                                </DropdownMenuContent>
                                                                                        </DropdownMenu>
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ));
                                                        })()}
                                                </TableBody>
                                        </Table>
                                        {!isLoadingFirstPage && files.results.length > 0 && (
                                                <div className="border-t">
                                                        <InfiniteScrollTrigger
                                                                canLoadMore={canLoadMore}
                                                                isLoadingMore={isLoadingMore}
                                                                onLoadMore={handleLoadMore}
                                                                ref={topElementRef}
                                                        />
                                                </div>
                                        )}
                                </div>
                        </div>
                </>
        );
};

export default FilesView;
