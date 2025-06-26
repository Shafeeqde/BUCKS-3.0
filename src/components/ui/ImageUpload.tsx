
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string | null;
  label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, initialImageUrl, label }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: 'File too large', description: 'Please select an image smaller than 5MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file)); // Show local preview immediately

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onUploadComplete(result.url);
      setPreviewUrl(result.url);
      toast({ title: 'Upload Successful', description: 'Image has been uploaded.' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload Failed', description: error instanceof Error ? error.message : 'Could not upload the image.', variant: 'destructive' });
      setPreviewUrl(initialImageUrl || null); // Revert to initial on failure
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreviewUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-input bg-muted/50 hover:bg-muted/80 transition-colors"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif, image/webp"
          disabled={uploading}
        />
        {previewUrl ? (
          <>
            <Image src={previewUrl} alt="Image preview" layout="fill" objectFit="contain" className="p-2 rounded-lg" />
             {!uploading && (
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 bg-background/60 hover:bg-background text-destructive" onClick={handleRemoveImage}>
                    <XCircleIcon className="h-5 w-5" />
                </Button>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <PhotoIcon className="w-8 h-8 mx-auto" />
            <p className="mt-1 text-sm">Click to upload image</p>
            <p className="text-xs">Max 5MB</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
            <span className="h-6 w-6 animate-spin border-4 border-background border-t-primary rounded-full"></span>
            <p className="text-white/90 text-sm mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
