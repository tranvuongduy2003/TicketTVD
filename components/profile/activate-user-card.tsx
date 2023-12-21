'use client';

import { userApi } from '@/apis';
import { MILLISECOND_PER_SECOND } from '@/constants';
import { useState } from 'react';
import { Button, Card, CardContent, toast } from '../ui';

export interface ActivateUserCardProps {
  userId: string;
}

export function ActivateUserCard({ userId }: ActivateUserCardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onActivateUser() {
    setIsLoading(true);
    try {
      await userApi.activateUser(userId);

      setIsLoading(false);
      toast({
        title: 'Kích hoạt tài khoản thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Kích hoạt tài khoản thất bại',
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
            onClick={onActivateUser}
            className="text-white text-base bg-green-500 hover:bg-green-400"
          >
            Kích hoạt tài khoản
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
