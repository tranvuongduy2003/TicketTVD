import { AuthLayout } from '@/components/layout';
import {
  Button,
  Checkbox,
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
import { PASSWORD_REGEX, PHONE_REGEX } from '@/constants/regex';
import { useAuth } from '@/hooks';
import { NextPageWithLayout, Role, UserStatus } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email không được để trống' })
      .max(100, { message: 'Email không được vượt quá 100 kí tự' })
      .email('Email không hợp lệ'),
    password: z
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
    name: z
      .string()
      .min(1, 'Họ tên không được để trống')
      .max(100, { message: 'Tên không được vượt quá 100 kí tự' }),
    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống')
      .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
      .max(100, { message: 'Số điện thoại không được vượt quá 100 kí tự' }),
    confirmPassword: z.string(),
    isOrganizer: z.boolean()
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không trùng khớp'
      });
    }
  });

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isOrganizer: false
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { email, name, phone, password, isOrganizer } = values;

      await signUp({
        email: email,
        name: name,
        phoneNumber: phone,
        password: password,
        role: isOrganizer ? Role.ORGANIZER : Role.CUSTOMER
      });

      setIsLoading(false);
      toast({
        title: 'Đăng ký tài khoản thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
      router.push('/auth/login');
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Đăng ký tài khoản thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return (
    <div className="relative w-full h-full flex py-12 justify-center items-center">
      {/* BACKGROUND */}
      <Image
        src="/images/auth-background.png"
        alt="auth-background"
        className="absolute z-0"
        fill
        style={{ objectFit: 'cover' }}
      />
      <div className="bg-primary-500 opacity-30 absolute z-10 w-full h-full top-0 left-0"></div>

      {/* SignUp FORM */}
      <div className="bg-white shadow-xs rounded-m px-20 py-9 w-[550px] z-20">
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
        <h2 className="text-center text-5xl font-bold leading-[68px]">
          Chào mừng
        </h2>
        <p className="leading-7 font-semibold text-neutral-500 text-lg text-center mb-8">
          Tạo tài khoản
        </p>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập số điện thoại"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Nhập lại mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isOrganizer"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={checked => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-base !mt-0">
                      Tôi muốn đăng kí tài khoản Chủ sự kiện
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
            <Button
              loading={isLoading}
              type="submit"
              className="text-white w-full text-base"
            >
              Đăng ký
            </Button>
          </form>
        </Form>

        {/* LOGIN CHOICE */}
        <p className="text-center mt-5">
          Bạn đã có tài khoản?{' '}
          <Link href={'/auth/login'}>
            <span className="text-primary-500 font-bold">Đăng nhập</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

SignUp.Layout = AuthLayout;

export default SignUp;
