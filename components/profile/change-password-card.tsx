import { userApi } from '@/apis';
import { MILLISECOND_PER_SECOND, PASSWORD_REGEX } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
  useToast
} from '../ui';

export interface ChangePasswordCardProps {
  userId: string;
}

const formSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 kí tự' })
      .max(32, { message: 'Mật khẩu không được vượt quá 32 kí tự' })
      .regex(
        PASSWORD_REGEX.lowerCase,
        'Mật khẩu phải có ít nhất 1 chữ cái in thường'
      )
      .regex(
        PASSWORD_REGEX.upperCase,
        'Mật khẩu phải có ít nhất 1 chữ cái in hoa'
      )
      .regex(PASSWORD_REGEX.number, 'Mật khẩu phải có ít nhất 1 chữ số')
      .regex(
        PASSWORD_REGEX.specialCharacter,
        'Mật khẩu phải có ít nhất 1 kí tự đặc biệt'
      ),
    confirmNewPassword: z.string()
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu không trùng khớp',
    path: ['confirmNewPassword']
  });

export function ChangePasswordCard({ userId }: ChangePasswordCardProps) {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { oldPassword, newPassword } = values;

      await userApi.changeUserPassword(userId, { oldPassword, newPassword });

      setIsLoading(false);
      toast({
        title: 'Thay đổi mật khẩu thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Thay đổi mật khẩu thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Nhập mật khẩu hiện tại"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Nhập mật khẩu mới" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Xác nhận lại mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          loading={isLoading}
          onClick={form.handleSubmit(onSubmit)}
          type="submit"
          className="text-white text-base"
        >
          Thay đổi mật khẩu
        </Button>
      </CardFooter>
    </Card>
  );
}
