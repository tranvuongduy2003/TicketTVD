import { AuthLayout } from '@/components/layout';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  useToast
} from '@/components/ui';
import { MILLISECOND_PER_SECOND } from '@/constants';
import { useAuth } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { LoginPayload } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Login: NextPageWithLayout = () => {
  const { logIn } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginPayload) {
    setIsLoading(true);
    try {
      await logIn(values);

      setIsLoading(false);
      toast({
        title: 'Đăng nhập thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Đăng nhập thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* BACKGROUND */}
      <Image
        src="/images/auth-background.png"
        alt="auth-background"
        fill
        className="absolute z-0"
        style={{ objectFit: 'cover' }}
      />
      <div className="bg-primary-500 opacity-30 absolute z-10 w-full h-full top-0 left-0"></div>

      {/* LOGIN FORM */}
      <div className="bg-white shadow-xs rounded-m px-20 py-16 w-[550px] z-20">
        {/* LOGO */}
        <Link
          href={'/'}
          className="flex items-center gap-[6px] justify-center mb-4"
        >
          <div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={43}
              height={60}
              style={{
                objectFit: 'cover'
              }}
            />
          </div>
          <h2 className="text-lg font-bold leading-7">
            <span className="text-neutral-700">Ticket</span>
            <span className="text-primary-500">TVD</span>
          </h2>
        </Link>

        {/* TITLE */}
        <h2 className="text-center text-[40px] font-bold mb-10">Đăng nhập</h2>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example.email@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Nhập mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={isLoading}
              type="submit"
              className="text-white w-full text-base"
            >
              Đăng nhập
            </Button>
          </form>
        </Form>

        {/* SIGNUP CHOICE */}
        <p className="text-center mt-10">
          Bạn vẫn chưa có tài khoản?{' '}
          <Link href={'/auth/signup'}>
            <span className="text-primary-500 font-bold">Đăng kí ngay</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

Login.Layout = AuthLayout;

export default Login;
