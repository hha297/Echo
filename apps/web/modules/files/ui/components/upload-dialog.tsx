'use client';

import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@workspace/ui/components/dropzone';
import { Button } from '@workspace/ui/components/button';

import { useState } from 'react';

import { api } from '@workspace/backend/_generated/api';
import { useAction } from 'convex/react';

interface UploadDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onFileUploaded?: () => void;
}

export const UploadDialog = ({ open, onOpenChange, onFileUploaded }: UploadDialogProps) => {
        const addFile = useAction(api.private.files.addFile);
        const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
        const [isUploading, setIsUploading] = useState(false);
        const [uploadForm, setUploadForm] = useState({
                category: '',
                filename: '',
        });

        const handleFileDrop = (acceptedFiles: File[]) => {
                const file = acceptedFiles[0];

                if (file) {
                        setUploadedFiles([file]);
                        if (!uploadForm.filename) {
                                setUploadForm((prev) => ({
                                        ...prev,
                                        filename: file.name,
                                }));
                        }
                }
        };

        const handleUpload = async () => {
                setIsUploading(true);
                try {
                        const blob = uploadedFiles[0];
                        if (!blob) return;

                        const filename = uploadForm.filename || blob.name;
                        await addFile({
                                bytes: await blob.arrayBuffer(),
                                mimeType: blob.type,
                                fileName: filename,
                                category: uploadForm.category,
                        });
                        onFileUploaded?.();
                        handleCancel();
                } catch (error) {
                        console.error(error);
                } finally {
                        setIsUploading(false);
                }
        };

        const handleCancel = () => {
                onOpenChange(false);
                setUploadedFiles([]);
                setUploadForm({
                        category: '',
                        filename: '',
                });
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                        <DialogTitle>Upload File</DialogTitle>
                                        <DialogDescription>
                                                Upload documents to your knowledge base for AI-Powered search and
                                                analysis.
                                        </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                        <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Input
                                                        className="w-full"
                                                        id="category"
                                                        placeholder="e.g. 'Documents', 'Sales', 'Products'"
                                                        value={uploadForm.category}
                                                        onChange={(e) =>
                                                                setUploadForm((prev) => ({
                                                                        ...prev,
                                                                        category: e.target.value,
                                                                }))
                                                        }
                                                />
                                        </div>
                                        <div className="space-y-2">
                                                <Label htmlFor="filename">
                                                        Filename{' '}
                                                        <span className="text-xs text-muted-foreground">
                                                                (optional)
                                                        </span>
                                                </Label>
                                                <Input
                                                        className="w-full"
                                                        id="filename"
                                                        placeholder="This will override the file name"
                                                        value={uploadForm.filename}
                                                        onChange={(e) =>
                                                                setUploadForm((prev) => ({
                                                                        ...prev,
                                                                        filename: e.target.value,
                                                                }))
                                                        }
                                                />
                                        </div>

                                        <Dropzone
                                                accept={{
                                                        'application/pdf': ['.pdf'],
                                                        'text/plain': ['.txt'],
                                                        'text/csv': ['.csv'],
                                                }}
                                                maxFiles={1}
                                                onDrop={handleFileDrop}
                                                src={uploadedFiles}
                                                disabled={isUploading}
                                        >
                                                <DropzoneContent />
                                                <DropzoneEmptyState />
                                        </Dropzone>
                                </div>
                                <DialogFooter>
                                        <Button disabled={isUploading} onClick={handleCancel}>
                                                Cancel
                                        </Button>
                                        <Button
                                                disabled={isUploading || !uploadedFiles.length || !uploadForm.category}
                                                onClick={handleUpload}
                                        >
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                        </Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
        );
};
