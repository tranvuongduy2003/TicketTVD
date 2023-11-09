import { userApi } from '@/apis';
import { MILLISECOND_PER_SECOND, QUERY_KEY } from '@/constants';
import { Status } from '@/models';
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

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  userId: string;
  status: Status;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  userId,
  status
}: ConfirmationDialogProps) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onDeactivateUser() {
    setIsLoading(true);
    try {
      await userApi.deactivateUser(userId);

      mutate(QUERY_KEY.users);

      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: 'Vô hiệu hóa người dùng thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Vô hiệu hóa người dùng thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  async function onActivateUser() {
    setIsLoading(true);
    try {
      await userApi.activateUser(userId);

      mutate(QUERY_KEY.users);

      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: 'Kích hoạt người dùng thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Kích hoạt người dùng thất bại',
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
          {status === Status.ACTIVE && (
            <DialogTitle className="text-red-500">
              Vô hiệu hóa người dùng
            </DialogTitle>
          )}
          {status === Status.DEACTIVE && (
            <DialogTitle className="text-green-700">
              Kích hoạt người dùng
            </DialogTitle>
          )}
          <DialogDescription className="text-base py-2">
            {status === Status.ACTIVE &&
              'Bạn có muốn vô hiệu hóa người dùng này không?'}
            {status === Status.DEACTIVE &&
              'Bạn có muốn kích hoạt người dùng này không?'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {status === Status.ACTIVE && (
            <Button
              loading={isLoading}
              type="submit"
              className="text-white bg-red-500 hover:bg-red-400"
              onClick={onDeactivateUser}
            >
              Vô hiệu hóa
            </Button>
          )}
          {status === Status.DEACTIVE && (
            <Button
              loading={isLoading}
              type="submit"
              className="text-white bg-green-700 hover:bg-green-500"
              onClick={onActivateUser}
            >
              Kích hoạt
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
