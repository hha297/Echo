'use client';

import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from '@workspace/ui/components/dialog';
import type { PublicFile } from '@workspace/backend/private/files';
import { useState } from 'react';

interface DeleteFileDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        file: PublicFile | null;
        onDelete?: () => void;
}

export const DeleteFileDialog = ({ open, onOpenChange, file, onDelete }: DeleteFileDialogProps) => {
        const deleteFile = useMutation(api.private.files.deleteFile);
        const [isDeleting, setIsDeleting] = useState(false);

        const handleDelete = async () => {
                if (!file) return;
                setIsDeleting(true);
                try {
                        await deleteFile({ entryId: file.id });
                        onDelete?.();
                        onOpenChange(false);
                } catch (error) {
                        console.error(error);
                } finally {
                        setIsDeleting(false);
                }
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                        <DialogTitle>Delete File</DialogTitle>
                                        <DialogDescription>
                                                Are you sure you want to delete this file? This action cannot be undone.
                                        </DialogDescription>
                                </DialogHeader>
                                {file && (
                                        <div className="py-4">
                                                <div className="rounded-lg border bg-muted/50 p-4">
                                                        <p className="font-medium text-muted-foreground">{file.name}</p>
                                                        <p className="text-muted-foreground">
                                                                Type: {file.type.toUpperCase()} | Size: {file.size}
                                                        </p>
                                                </div>
                                        </div>
                                )}
                                <DialogFooter>
                                        <Button
                                                variant="outline"
                                                onClick={() => onOpenChange(false)}
                                                disabled={isDeleting}
                                        >
                                                Cancel
                                        </Button>
                                        <Button
                                                disabled={isDeleting || !file}
                                                onClick={handleDelete}
                                                variant="destructive"
                                        >
                                                {isDeleting ? 'Deleting...' : 'Delete'}
                                        </Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
        );
};
