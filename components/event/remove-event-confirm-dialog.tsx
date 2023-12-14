'use client';

import { eventApi } from '@/apis';
import { MILLISECOND_PER_SECOND, QUERY_KEY } from '@/constants';
import { useState } from 'react';
import { mutate } from 'swr';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast
} from '../ui';

export interface RemoveEventConfirmDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  eventId: number;
}

export function RemoveEventConfirmDialog({
  open,
  onOpenChange,
  eventId
}: RemoveEventConfirmDialogProps) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onDeleteEvent() {
    setIsLoading(true);
    try {
      await eventApi.deleteEvent(eventId);

      mutate(QUERY_KEY.events);

      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: 'Xóa sự kiện thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Xóa sự kiện thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">Xóa sự kiện</DialogTitle>
          <DialogDescription className="text-base py-2">
            Bạn có muốn xóa sự kiện này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            loading={isLoading}
            type="submit"
            className="text-white bg-red-500 hover:bg-red-400"
            onClick={onDeleteEvent}
          >
            Đồng ý
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
