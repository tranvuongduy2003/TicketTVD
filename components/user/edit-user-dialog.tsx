import { fileApi, userApi } from '@/apis';
import { MILLISECOND_PER_SECOND, PHONE_REGEX, QUERY_KEY } from '@/constants';
import { useUser } from '@/hooks';
import { Gender, Role, Status, User } from '@/models';
import { cn } from '@/types';
import { compressFile, convertToISODate, getFile, getImageData } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuCalendar, LuChevronDown, LuUpload } from 'react-icons/lu';
import { mutate } from 'swr';
import * as z from 'zod';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '../ui';

export interface EditUserDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  userId: string;
}

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
  dob: z.any(),
  gender: z.string(),
  status: z.string(),
  role: z.string(),
  createdAt: z.any().optional(),
  avatar: z.any()
});

export function EditUserDialog({
  open,
  onOpenChange,
  userId
}: EditUserDialogProps) {
  const { toast } = useToast();

  const { user, isLoading, mutate: userMutate } = useUser(userId ?? '');

  const [loading, setLoading] = useState<boolean>(false);
  const [isShowExtensiveInfo, setIsShowExtensiveInfo] =
    useState<boolean>(false);
  const [isShowExtensiveChangePassword, setIsShowExtensiveChangePassword] =
    useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { phone, dob, email, gender, name, role, ...rest } = values;

      const payload: Partial<User> = {
        avatar: avatarPreview,
        email: email,
        name: name,
        phoneNumber: phone,
        dob: convertToISODate(dob),
        gender: gender,
        role: role as Role,
        ...rest
      };

      // Upload avatar
      if (avatar) {
        const compressedAvatar = await compressFile(avatar);
        const { data: avatarUrl } = await fileApi.uploadFile(compressedAvatar);
        payload.avatar = avatarUrl!.blob.uri;
      }

      await userApi.updateUser(user?.id ?? '', payload);

      mutate([QUERY_KEY.user, user?.id]);
      mutate(QUERY_KEY.users);

      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin người dùng thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin người dùng thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  useEffect(() => {
    (async () => {
      if (user) {
        form.reset({
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          phone: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
          status: user.status
        });

        if (user.avatar) {
          setAvatarPreview(user.avatar);
          const { data: avatarFile } = await getFile(user.avatar);
          setAvatar(avatarFile);
        }
      }
    })();
  }, [user]);

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          // {...form}
          className="max-w-screen-md overflow-y-scroll max-h-[80vh]"
        >
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>
          {isLoading || !user ? (
            <Loading />
          ) : (
            <>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-8"
              >
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="relative block mx-auto w-32 h-32 rounded-full">
                          <Avatar className="w-full h-full">
                            <AvatarImage
                              src={avatarPreview}
                              alt="avatar"
                              style={{ objectFit: 'cover' }}
                            />
                            <AvatarFallback>AV</AvatarFallback>
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
                            multiple={false}
                            onChange={event => {
                              const { files, displayUrl } = getImageData(event);
                              setAvatarPreview(displayUrl);
                              setAvatar(files[0]);
                              onChange(files);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập họ tên"
                          {...field}
                        />
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
                  name="dob"
                  defaultValue={user.dob}
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-col"
                      defaultValue={user.dob as any}
                    >
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
                                format(new Date(field.value), 'dd/MM/yyyy')
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
                  defaultValue={user.gender}
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem defaultValue={user.gender}>
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
                            <span className="capitalize">Nam</span>
                          </SelectItem>
                          <SelectItem value={Gender.FEMALE}>
                            <span className="capitalize">Nữ</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        {field.value === Status.ACTIVE ? (
                          <div>
                            <Badge className="px-4 py-2 text-sm bg-success-100 text-success-700 hover:bg-success-100 hover:text-success-700">
                              Hoạt động
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <Badge className="px-4 py-2 text-sm bg-danger-100 text-danger-500 hover:bg-danger-100 hover:text-danger-500">
                              Ngưng hoạt động
                            </Badge>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={user.role}
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Role.CUSTOMER}>
                            <span className="!capitalize">Khách hàng</span>
                          </SelectItem>
                          <SelectItem value={Role.ORGANIZER}>
                            <span className="!capitalize">Chủ sự kiện</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={user.createdAt}
                  control={form.control}
                  name="createdAt"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem defaultValue={user.createdAt as any}>
                      <FormLabel>Ngày tham gia</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={true}
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? format(new Date(field.value), 'dd/MM/yyyy')
                                : format(new Date(), 'dd/MM/yyyy')}
                              <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={vi}
                            lang="vi"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={date =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
              <div className="mt-5">
                <div
                  className="flex items-center gap-2 cursor-pointer mb-3"
                  onClick={() => setIsShowExtensiveInfo(!isShowExtensiveInfo)}
                >
                  <h3 className="text-lg font-semibold">Thông tin thêm</h3>
                  <LuChevronDown />
                </div>
              </div>
              <div className="mt-3">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    setIsShowExtensiveChangePassword(
                      !isShowExtensiveChangePassword
                    )
                  }
                >
                  <h3 className="text-lg font-semibold mb-3">
                    Thay đổi mật khẩu
                  </h3>
                  <LuChevronDown />
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button
              loading={loading}
              type="submit"
              className="text-white"
              onClick={form.handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
