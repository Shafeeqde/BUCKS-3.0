import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProfileSectionListProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, onEdit: () => void, onDelete: () => void) => React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
  dialogFields: React.ReactNode;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onDialogSave: () => void;
  onDialogCancel: () => void;
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  itemToDelete?: T | null;
  emptyText?: string;
  addButtonText?: string;
}

function ProfileSectionList<T extends { id?: string }>({
  title,
  items,
  renderItem,
  dialogTitle,
  dialogDescription,
  dialogFields,
  onAdd,
  onEdit,
  onDelete,
  onDialogSave,
  onDialogCancel,
  showDialog,
  setShowDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  itemToDelete,
  emptyText,
  addButtonText
}: ProfileSectionListProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg flex items-center">{title}</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusCircleIcon className="mr-1.5 h-4 w-4" />{addButtonText || 'Add'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{emptyText || 'No entries yet.'}</p>}
        {items.map(item => (
          <div key={item.id} className="p-3 rounded-md border bg-muted/30">
            {renderItem(item, () => onEdit(item), () => onDelete(item))}
          </div>
        ))}
      </CardContent>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}
          </DialogHeader>
          {dialogFields}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" onClick={onDialogCancel}>Cancel</Button></DialogClose>
            <Button type="button" onClick={onDialogSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this entry? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToDelete && onDelete(itemToDelete)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default ProfileSectionList;
