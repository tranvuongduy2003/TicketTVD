import { categoryApi } from '@/apis';
import { AdminLayout } from '@/components/layout';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GradientPicker,
  Input,
  useToast
} from '@/components/ui';
import { Category, CreateCategoryPayload, NextPageWithLayout } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên thể loại không được để trống')
    .max(100, { message: 'Tên thể loại vượt quá 100 kí tự' }),
  color: z.string()
});

const CreateCategoryPage: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      color: '#0072ff'
    },
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const { name, color } = values;

      const payload: CreateCategoryPayload = {
        name: name,
        color: color
      };

      await categoryApi.createCategory(payload);

      setLoading(false);
      toast({
        title: 'Tạo thể loại mới thành công',
        description: '',
        duration: 500
      });
      router.push('/management/category');
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Tạo thể loại mới thất bại',
        description: error,
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Tạo thể loại mới
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 mx-72"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên thể loại</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nhập tên thể loại"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Màu phân loại</FormLabel>
                <FormControl>
                  <div
                    className="w-full h-full preview flex min-h-[200px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
                    style={{ background: field.value }}
                  >
                    <GradientPicker
                      background={field.value}
                      setBackground={bg => {
                        field.onChange(bg);
                      }}
                    />
                  </div>
                </FormControl>
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
                Tạo
              </Button>
            </FormControl>
          </FormItem>
        </form>
      </Form>
    </div>
  );
};

CreateCategoryPage.Layout = AdminLayout;

export default CreateCategoryPage;
