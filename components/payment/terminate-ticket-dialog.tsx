import React, { useState } from 'react';
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
import { MILLISECOND_PER_SECOND } from '@/constants';
import { ticketApi } from '@/apis';

export interface ITerminateTicketDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  ticketId: number;
}

export function TerminateTicketDialog({
  open,
  onOpenChange,
  ticketId
}: ITerminateTicketDialogProps) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onTerminateTicket() {
    setIsLoading(true);
    try {
      await ticketApi.terminateTicket(ticketId);

      //   mutate(QUERY_KEY.users);

      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: 'Hủy vé thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Hủy vé thất bại',
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
          <DialogTitle className="text-red-500">Hủy vé sự kiện</DialogTitle>
          <DialogDescription className="text-base py-2">
            Bạn có muốn hủy vé này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            loading={isLoading}
            type="submit"
            className="text-white bg-red-500 hover:bg-red-400"
            onClick={onTerminateTicket}
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
