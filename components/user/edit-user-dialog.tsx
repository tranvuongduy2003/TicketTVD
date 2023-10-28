import { PHONE_REGEX } from '@/constants';
import { useUser } from '@/hooks';
import { Gender, Role, Status } from '@/models';
import { cn } from '@/types';
import { getImageData } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuCalendar, LuUpload } from 'react-icons/lu';
import * as z from 'zod';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .max(100, { message: 'Email không được vượt quá 100 kí tự' })
    .email('Email không hợp lệ'),
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
  status: z.string(),
  role: z.string(),
  createdAt: z.date(),
  avatar: z.string()
});

export function EditUserDialog({
  open,
  onOpenChange,
  userId
}: EditUserDialogProps) {
  const { toast } = useToast();

  const { user, isLoading } = useUser(userId ?? '');

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log(values);

      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin người dùng thành công',
        description: '',
        duration: 500
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Chỉnh sửa thông tin người dùng thất bại',
        description: error,
        variant: 'destructive'
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...form}
        className="max-w-screen-md overflow-y-scroll max-h-[80vh]"
      >
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>
        {isLoading || !user ? (
          <Loading />
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-8"
              >
                <div className="col-span-2">
                  <FormField
                    defaultValue={user.avatar}
                    control={form.control}
                    name="avatar"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="relative block mx-auto w-32 h-32 rounded-full">
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
                </div>
                <FormField
                  defaultValue={user.name}
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
                  defaultValue={user.email}
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
                  defaultValue={user.phoneNumber}
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
                  defaultValue={new Date(user.dob)}
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
                <FormField
                  defaultValue={user.gender}
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
                <FormField
                  defaultValue={user.status}
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
                            <span className="!capitalize">
                              {Role.CUSTOMER.toLowerCase()}
                            </span>
                          </SelectItem>
                          <SelectItem value={Role.ORGANIZER}>
                            <span className="!capitalize">
                              {Role.ORGANIZER.toLowerCase()}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  defaultValue={new Date(user.createdAt)}
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tham gia</FormLabel>
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
                              {field.value
                                ? format(field.value, 'dd/MM/yyyy')
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
            </Form>
            <Card className="mt-8 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin thêm</CardTitle>
              </CardHeader>
              <CardContent>
                {user.totalBuyedTickets !== null && (
                  <div className="mb-2">
                    Tổng số vé đã mua: {user.totalBuyedTickets}
                  </div>
                )}
                {user.totalEvents !== null && (
                  <div className="mb-2">
                    Tổng số vé đã mua: {user.totalEvents}
                  </div>
                )}
                {user.totalSoldTickets !== null && (
                  <div className="mb-2">
                    Tổng số vé đã mua: {user.totalSoldTickets}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        <DialogFooter>
          <Button
            loading={loading}
            type="submit"
            className="text-white"
            onClick={form.handleSubmit(onSubmit)}
          >
            Đăng ký
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
