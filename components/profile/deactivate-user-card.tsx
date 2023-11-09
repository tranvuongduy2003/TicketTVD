import { userApi } from '@/apis';
import { MILLISECOND_PER_SECOND } from '@/constants';
import { useState } from 'react';
import { Button, Card, CardContent, toast } from '../ui';

export interface DeactivateUserCardProps {
  userId: string;
}

export function DeactivateUserCard({ userId }: DeactivateUserCardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onDeactivateUser() {
    setIsLoading(true);
    try {
      await userApi.deactivateUser(userId);

      setIsLoading(false);
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <p>Bạn có thể kích hoạt lại bất cứ khi nào bạn muốn.</p>
          <Button
            loading={isLoading}
            type="submit"
            onClick={onDeactivateUser}
            className="text-white text-base bg-red-500 hover:bg-red-400"
          >
            Vô hiệu hóa tài khoản
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
