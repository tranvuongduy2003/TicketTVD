import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui';

export interface DisableConfirmationDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  onOk(): void;
}

export function DisableConfirmationDialog({
  open,
  onOpenChange,
  onOk
}: DisableConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">
            Vô hiệu hóa người dùng
          </DialogTitle>
          <DialogDescription className="text-base py-2">
            Bạn có muốn vô hiệu hóa người dùng này không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="text-white bg-red-500 hover:bg-red-400"
            onClick={onOk}
          >
            Vô hiệu hóa
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
