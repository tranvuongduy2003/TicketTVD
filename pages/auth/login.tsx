import { AuthLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { NextPageWithLayout } from '@/models';
import { LoginPayload } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaFacebookF, FaGoogle } from 'react-icons/fa6';

const Login: NextPageWithLayout = () => {
  // 1. Define your form.
  const form = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: LoginPayload) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
            <Button type="submit" className="text-white w-full text-base">
              Đăng nhập
            </Button>
          </form>
        </Form>

        {/* OTHER CHOICES */}
        <div className="mt-[50px] mb-10">
          <p className="text-center text-sm text-neutral-500 mb-[18px]">
            Hoặc đăng nhập với
          </p>
          <div className="flex items-center justify-between gap-4 px-2">
            <Button className="text-[#C71610FF] bg-[#FEF1F1FF] hover:bg-[#FDEEEDFF] active:bg-[#FDEEEDFF] w-full">
              <FaGoogle />
            </Button>
            <Button className="text-[#335CA6FF] bg-[#F3F6FBFF] hover:bg-[#F0F4FAFF] active:bg-[#E7ECF7FF] w-full">
              <FaFacebookF />
            </Button>
          </div>
        </div>

        {/* SIGNUP CHOICE */}
        <p className="text-center">
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
