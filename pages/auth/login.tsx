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
import { useAuth } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { LoginPayload } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Login: NextPageWithLayout = () => {
  const router = useRouter();
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
        duration: 500
      });
      router.push('/');
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Đăng nhập thất bại',
        description: error,
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      {/* BACKGROUND */}
      <Image
        src="/images/auth-background.png"
        alt="auth-background"
        fill={true}
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="bg-primary-500 opacity-30 absolute z-10 w-full h-full top-0 left-0"></div>

      {/* LOGIN FORM */}
      <div className="bg-white shadow-xs rounded-m px-20 py-16 w-[550px] z-20">
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

        {/* OTHER CHOICES */}
        {/* <div className="mt-[50px] mb-10">
          <p className="text-center text-sm text-neutral-500 mb-[18px]">
            Hoặc đăng nhập với
          </p>
          <div className="flex items-center justify-between gap-4 px-2">
            <Button
              onClick={() => logInWithGoogle()}
              className="text-[#C71610FF] bg-[#FEF1F1FF] hover:bg-[#FDEEEDFF] active:bg-[#FDEEEDFF] w-full"
            >
              <FaGoogle />
            </Button>
            <Button
              onClick={() => logInWithFacebook()}
              className="text-[#335CA6FF] bg-[#F3F6FBFF] hover:bg-[#F0F4FAFF] active:bg-[#E7ECF7FF] w-full"
            >
              <FaFacebookF />
            </Button>
          </div>
        </div> */}

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
