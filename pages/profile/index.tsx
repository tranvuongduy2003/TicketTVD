import { fileApi, userApi } from '@/apis';
import { AdminLayout } from '@/components/layout';
import { ChangePasswordCard, DeactivateUserCard } from '@/components/profile';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Loading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast
} from '@/components/ui';
import { PHONE_REGEX } from '@/constants';
import { useAuth } from '@/hooks';
import { Gender, NextPageWithLayout, User } from '@/models';
import { useProfileStore } from '@/stores';
import { cn } from '@/types';
import { getImageData } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuCalendar, LuUpload } from 'react-icons/lu';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string(),
  name: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, { message: 'Tên không được vượt quá 100 kí tự' }),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
    .max(100, { message: 'Số điện thoại không được vượt quá 100 kí tự' }),
  dob: z.date(),
  gender: z.string(),
  avatar: z.any()
});

const Profile: NextPageWithLayout = () => {
  const { toast } = useToast();

  const { profile, isLoading } = useAuth();
  const { setProfile } = useProfileStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setPreview(profile.avatar);
    }
  }, [profile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { avatar, phone, ...rest } = values;

      const payload: Partial<User> = { phoneNumber: phone, ...rest };

      if (Boolean(avatar) && avatar.length > 0) {
        const avatarBlob = await fileApi.uploadFile(avatar[0]);
        payload.avatar = avatarBlob.blob.uri;
      }

      await userApi.updateUser(profile?.id ?? '', payload);

      setProfile(payload);

      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin cá nhân thành công',
        description: '',
        duration: 500
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin cá nhân thất bại',
        description: error,
        variant: 'destructive'
      });
    }
  }
  return (
    <div className="mx-36 my-9">
      <h1 className="text-[32px] leading-[48px] font-bold text-neutral-900 mb-6">
        Thông tin cá nhân
      </h1>
      {isLoading || !profile ? (
        <Loading />
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="relative block mx-auto w-[138px] h-[138px] rounded-full">
                      <Avatar className="w-full h-full">
                        <AvatarImage
                          src={preview}
                          alt="avatar"
                          style={{ objectFit: 'cover' }}
                        />
                        <AvatarFallback>BU</AvatarFallback>
                      </Avatar>
                      <div className="opacity-0 transition-all rounded-full absolute top-0 left-0 w-full h-full flex items-center justify-center hover:bg-black hover:opacity-60">
                        <LuUpload className="h-7 w-7 text-white" />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="hidden"
                        type="file"
                        {...rest}
                        onChange={event => {
                          const { files, displayUrl } = getImageData(event);
                          setPreview(displayUrl);
                          onChange(files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                defaultValue={profile?.name}
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
                defaultValue={profile.email}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={true}
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
                defaultValue={profile.phoneNumber}
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
                defaultValue={profile?.dob && new Date(profile?.dob)}
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày sinh</span>
                            )}
                            <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={vi}
                          lang="vi"
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                defaultValue={profile.gender}
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>
                          <span className="capitalize">
                            {Gender.MALE.toLowerCase()}
                          </span>
                        </SelectItem>
                        <SelectItem value={Gender.FEMALE}>
                          <span className="capitalize">
                            {Gender.FEMALE.toLowerCase()}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormControl className="float-right">
                  <Button
                    loading={loading}
                    type="submit"
                    className="text-white"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Lưu
                  </Button>
                </FormControl>
              </FormItem>
            </form>
          </Form>
          <div className="flex justify-between mt-12">
            <h2 className="mt-2 text-xl leading-[30px] font-bold text-neutral-900">
              Đổi mật khẩu
            </h2>
            <div className="w-2/3">
              <ChangePasswordCard userId={profile.id} />
            </div>
          </div>
          <div className="flex justify-between mt-12">
            <h2 className="mt-2 text-xl leading-[30px] font-bold text-neutral-900">
              Vô hiệu hóa
            </h2>
            <div className="w-2/3">
              <DeactivateUserCard userId={profile.id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Profile.Layout = AdminLayout;

export default Profile;
