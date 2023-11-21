import { eventApi, fileApi } from '@/apis';
import { CreateEventSection, SearchEventCard } from '@/components/event';
import { OrganizerLayout } from '@/components/layout';
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Textarea,
  TimePicker,
  toast
} from '@/components/ui';
import { MILLISECOND_PER_SECOND } from '@/constants';
import { useAuth, useCategories } from '@/hooks';
import { District, Event, NextPageWithLayout, Province } from '@/models';
import { cn } from '@/types';
import {
  compressFile,
  concatDateWithTime,
  formatDate,
  formatDateToLocaleDate,
  getImageData
} from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LuAlertCircle,
  LuArrowLeft,
  LuArrowRight,
  LuCalendar,
  LuCheck,
  LuClock,
  LuImage,
  LuMapPin,
  LuPlus,
  LuTicket,
  LuTrash2,
  LuX
} from 'react-icons/lu';
import * as z from 'zod';

const uploadCoverImageFormSchema = z.object({
  coverImage: z
    .any()
    .refine(image => image && image.length > 0, 'Vui lòng tải ảnh bìa lên')
});

const generalInfoFormSchema = z.object({
  name: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }),
  description: z.string({ required_error: 'Vui lòng nhập mô tả sự kiện' }),
  categoryId: z.string({ required_error: 'Vui lòng chọn thể loại' }),
  album: z.any()
});

const addressFormSchema = z.object({
  address: z.string({ required_error: 'Vui lòng nhập địa chỉ' }),
  district: z.string({ required_error: 'Vui lòng chọn quận / huyện' }),
  province: z.string({ required_error: 'Vui lòng chọn tỉnh / thành phố' }),
  eventDate: z.date({ required_error: 'Vui lòng chọn ngày tổ chức sự kiện' }),
  startTime: z.date({
    required_error: 'Vui lòng chọn thời gian bắt đầu sự kiện'
  }),
  endTime: z.date({
    required_error: 'Vui lòng chọn thời gian kết thúc sự kiện'
  })
});

const ticketInfoFormSchema = z.object({
  isPaid: z.string(),
  quantity: z
    .any()
    .refine(
      quantity => quantity && quantity !== '',
      'Vui lòng nhập số lượng vé'
    )
    .refine(
      quantity => quantity && Number.parseInt(quantity) > 0,
      'Số lượng vé không hợp lệ'
    ),
  price: z.any().optional(),
  ticketStartDate: z.date({
    required_error: 'Vui lòng chọn ngày mở bán vé'
  }),
  ticketStartTime: z.date({
    required_error: 'Vui lòng chọn thời gian mở bán vé'
  }),
  ticketCloseDate: z.date({
    required_error: 'Vui lòng chọn ngày đóng bán vé'
  }),
  ticketCloseTime: z.date({
    required_error: 'Vui lòng chọn thời gian đóng bán vé'
  }),
  isPromotion: z.boolean().default(false),
  promotionPlan: z
    .any()
    .refine(
      promotionPlan => promotionPlan && Number.parseInt(promotionPlan) > 0,
      'Khuyến mãi không hợp lệ'
    )
    .optional()
});

const publishFormSchema = z.object({
  isPublish: z.boolean().default(false),
  publishTime: z.date().optional(),
  publishDate: z.date().optional()
});

const CreateEventPage: NextPageWithLayout = () => {
  const { categories } = useCategories();
  const { profile } = useAuth();

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>('');
  const [coverImage, setCoverImage] = useState<File | null>();
  const [albumPreview, setAlbumPreview] = useState<string[]>([]);
  const [album, setAlbum] = useState<File[]>([]);
  const [step, setStep] = useState<number>(1);
  const [districts, setDistricts] = useState<District[]>();
  const [provinces, setProvinces] = useState<Province[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadCoverImageForm = useForm<
    z.infer<typeof uploadCoverImageFormSchema>
  >({
    resolver: zodResolver(uploadCoverImageFormSchema)
  });

  const generalInfoForm = useForm<z.infer<typeof generalInfoFormSchema>>({
    resolver: zodResolver(generalInfoFormSchema)
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema)
  });

  const ticketInfoForm = useForm<z.infer<typeof ticketInfoFormSchema>>({
    resolver: zodResolver(ticketInfoFormSchema)
  });

  const publishForm = useForm<z.infer<typeof publishFormSchema>>({
    resolver: zodResolver(publishFormSchema)
  });

  const handleFetchProvinces = useRef<any>(null);
  const handleFetchDistricts = useRef<any>(null);

  useEffect(() => {
    handleFetchProvinces.current = async () => {
      try {
        const provincesData = await fetch('/data/tinh_tp.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }).then(function (response) {
          return response.json();
        });
        setProvinces(provincesData);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchProvinces.current();
    () => handleFetchProvinces.current;
  }, []);

  useEffect(() => {
    handleFetchDistricts.current = async () => {
      if (!addressForm.watch().province || addressForm.watch().province === '')
        return;
      try {
        const districtsData = await fetch('/data/quan_huyen.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }).then(function (response) {
          return response.json();
        });
        const districtsInProvince = districtsData.filter(
          (item: District) => item.parent_code === addressForm.watch().province
        );
        setDistricts(districtsInProvince);
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchDistricts.current();
    () => handleFetchDistricts.current;
  }, [addressForm.watch().province]);

  async function handleCreateEvent() {
    setIsLoading(true);
    try {
      const { categoryId, description, name } = generalInfoForm.getValues();

      const { address, district, endTime, eventDate, startTime } =
        addressForm.getValues();

      const {
        isPaid,
        price,
        quantity,
        isPromotion,
        promotionPlan,
        ticketCloseDate,
        ticketCloseTime,
        ticketStartDate,
        ticketStartTime
      } = ticketInfoForm.getValues();

      const { isPublish, publishDate, publishTime } = publishForm.getValues();

      console.log(
        concatDateWithTime(new Date(ticketStartDate), new Date(ticketStartTime))
      );

      const data: Partial<Event> = {
        name: name,
        description: description,
        categoryId: Number.parseInt(categoryId),
        location: `${address}, ${districts?.find(item => item.code === district)
          ?.path_with_type}`,
        eventDate: new Date(eventDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        ticketIsPaid: isPaid === 'paid' ? true : false,
        ticketQuantity: Number.parseInt(quantity),
        ticketPrice: Number.parseInt(price),
        ticketStartTime: concatDateWithTime(ticketStartDate, ticketStartTime),
        ticketCloseTime: concatDateWithTime(ticketCloseDate, ticketCloseTime),
        isPromotion: isPromotion,
        promotionPlan: isPromotion ? Number.parseInt(promotionPlan) : 0,
        album: [],
        creatorId: profile?.id
      };

      if (isPublish) {
        data.publishTime = concatDateWithTime(
          publishDate || new Date(),
          publishTime || new Date()
        );
      }

      // Upload cover image
      if (coverImage) {
        const compressedCoverImage = await compressFile(coverImage!);
        console.log(
          '🚀 ~ file: create.tsx:270 ~ handleCreateEvent ~ compressedCoverImage:',
          compressedCoverImage
        );
        const coverImageUrl = await fileApi.uploadFile(compressedCoverImage);
        console.log(
          '🚀 ~ file: create.tsx:275 ~ handleCreateEvent ~ coverImageUrl:',
          coverImageUrl
        );
        data.coverImage = coverImageUrl.blob.uri;
      }
      // Upload albums
      if (album && album.length > 0) {
        const albumUrls = await Promise.all(
          album.map(
            async item =>
              new Promise<string>(async (resolve, reject) => {
                try {
                  const compressedCoverImage = await compressFile(item);
                  const coverImageUrl =
                    await fileApi.uploadFile(compressedCoverImage);
                  resolve(coverImageUrl.blob.uri);
                } catch (error) {
                  reject(error);
                }
              })
          )
        );
        data.album = albumUrls;
      }

      await eventApi.createEvent(data);

      setIsLoading(false);
      toast({
        title: 'Tạo sự kiện mới thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Tạo sự kiện mới thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return (
    <div className="mx-[132px] my-[34px]">
      {/* HEADER */}
      <h2 className="text-[32px] font-bold leading-[48px] mb-8">
        Tạo sự kiện mới
      </h2>

      {/* CONTENT */}
      <div className="flex gap-[86px]">
        {/* LEFT */}
        <div className="w-1/3">
          <div className="rounded-xl bg-neutral-150">
            <div className="px-6 py-[30px]">
              <h5 className="text-neutral-550 leading-[26px] mb-2">
                Cập nhật lần cuối
              </h5>
              <p className="font-bold leading-[26px] mb-[18px]">
                {formatDate(new Date())}
              </p>
              <h5 className="text-neutral-550 leading-[26px] mb-2">
                Trạng thái
              </h5>
              <p className="font-bold leading-[26px]">Bản nháp</p>
            </div>
            <Separator />
            <div>
              <h5 className="text-xl font-bold text-neutral-650 px-6 pt-5 pb-2 uppercase">
                Thông tin sự kiện
              </h5>
              <div className="p-2">
                <p
                  className={cn(
                    'text-lg leading-[28px] p-4 text-neutral-600 flex items-center justify-between transition-all',
                    uploadCoverImageForm.formState.isValid &&
                      'text-primary-500 font-bold'
                  )}
                >
                  Tải lên ảnh bìa
                  <LuCheck
                    className={cn(
                      uploadCoverImageForm.formState.isValid
                        ? 'block'
                        : 'hidden'
                    )}
                  />
                </p>
                <p
                  className={cn(
                    'text-lg leading-[28px] p-4 text-neutral-600 flex items-center justify-between transition-all',
                    generalInfoForm.formState.isValid &&
                      'text-primary-500 font-bold'
                  )}
                >
                  Thông tin chung
                  <LuCheck
                    className={cn(
                      generalInfoForm.formState.isValid ? 'block' : 'hidden'
                    )}
                  />
                </p>
                <p
                  className={cn(
                    'text-lg leading-[28px] p-4 text-neutral-600 flex items-center justify-between transition-all',
                    addressForm.formState.isValid &&
                      'text-primary-500 font-bold'
                  )}
                >
                  Địa điểm và thời gian
                  <LuCheck
                    className={cn(
                      addressForm.formState.isValid ? 'block' : 'hidden'
                    )}
                  />
                </p>
                <p
                  className={cn(
                    'text-lg leading-[28px] p-4 text-neutral-600 flex items-center justify-between transition-all',
                    ticketInfoForm.formState.isValid &&
                      'text-primary-500 font-bold'
                  )}
                >
                  Thông tin vé
                  <LuCheck
                    className={cn(
                      ticketInfoForm.formState.isValid ? 'block' : 'hidden'
                    )}
                  />
                </p>
              </div>
            </div>
            <Separator />
            <div className="pb-[52px]">
              <h5 className="text-xl font-bold text-neutral-650 px-6 pt-5 pb-2 uppercase">
                Xuất bản sự kiện
              </h5>
              <div className="p-2">
                <p
                  className={cn(
                    'text-lg leading-[28px] p-4 text-neutral-600 transition-all',
                    step === 2 && 'text-primary-500 font-bold'
                  )}
                >
                  Xem trước và xuất bản
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-2/3">
          {step === 1 && (
            <>
              <CreateEventSection icon={<LuImage />} title="Tải lên ảnh bìa">
                <p className="mt-[10px] leading-[22px] text-neutral-550 mb-5">
                  Tải lên ảnh bìa sự kiện để thu hút sự chú ý của người tham gia
                </p>
                <Form {...uploadCoverImageForm}>
                  <form onSubmit={uploadCoverImageForm.handleSubmit(() => {})}>
                    <FormField
                      control={uploadCoverImageForm.control}
                      name="coverImage"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          {coverImagePreview && (
                            <div className="relative overflow-hidden w-full h-[332px] rounded-m bg-neutral-200 hover:bg-neutral-300 cursor-pointer">
                              <Image
                                src={coverImagePreview}
                                alt="cover-image"
                                fill
                                objectFit="cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-550">
                              {coverImage?.name}
                            </span>
                            <div className="flex items-center gap-4">
                              <Button
                                type="reset"
                                variant={'ghost'}
                                className="flex gap-2 items-center text-danger-500 hover:bg-danger-100 hover:text-danger-500"
                                onClick={() => {
                                  setCoverImagePreview(null);
                                  setCoverImage(null);
                                  onChange([]);
                                }}
                              >
                                <LuTrash2 /> Hủy bỏ
                              </Button>
                              <FormLabel className="h-10 rounded-md cursor-pointer px-4 py-2 flex gap-2 items-center text-primary-500 bg-primary-100 hover:bg-primary-150">
                                Thay đổi
                              </FormLabel>
                            </div>
                          </div>
                          <FormControl>
                            <Input
                              className="hidden"
                              type="file"
                              {...rest}
                              multiple={false}
                              onChange={event => {
                                const { files, displayUrl } =
                                  getImageData(event);
                                setCoverImagePreview(displayUrl);
                                setCoverImage(files[0]);
                                onChange(files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CreateEventSection>
              <Separator className="mt-5 mb-6" />
              <CreateEventSection
                icon={<LuAlertCircle />}
                title="Thông tin chung"
              >
                <Form {...generalInfoForm}>
                  <form className="my-6 gap-6 flex flex-col">
                    <FormField
                      control={generalInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-xl font-bold">Tên</span>
                          </FormLabel>
                          <p className="text-sm text-neutral-550 my-2">
                            Đặt tên hấp dẫn và đáng nhớ
                          </p>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập tên sự kiện"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalInfoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-xl font-bold">Mô tả</span>
                          </FormLabel>
                          <p className="text-sm text-neutral-550 my-2">
                            Cung cấp những thông tin chi tiết về sự kiện
                          </p>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập mô tả sự kiện"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalInfoForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-xl font-bold">Thể loại</span>
                          </FormLabel>
                          <p className="text-sm text-neutral-550 my-2">
                            Chọn thể loại cho sự kiện của bạn
                          </p>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn thể loại" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map(category => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalInfoForm.control}
                      name="album"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <div className="flex items-start gap-4">
                            {albumPreview?.map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center gap-2 w-[90px]"
                              >
                                <div className="text-2xl h-[90px] w-[90px] overflow-hidden rounded-m inline-block relative">
                                  <Image
                                    src={item}
                                    alt="album-image"
                                    fill
                                    objectFit="cover"
                                  />
                                </div>
                                <p className="break-all">
                                  {album &&
                                    album.length > 0 &&
                                    album[index].name}
                                </p>
                              </div>
                            ))}
                            {album.length < 5 && (
                              <FormLabel className="text-2xl p-8 border rounded-m inline-block border-dashed">
                                <LuPlus />
                              </FormLabel>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              className="hidden"
                              type="file"
                              {...rest}
                              multiple={false}
                              onChange={event => {
                                const { files, displayUrl } =
                                  getImageData(event);
                                setAlbumPreview(preAlbumPreview => {
                                  preAlbumPreview.push(displayUrl);
                                  return preAlbumPreview;
                                });
                                setAlbum(preAlbum => {
                                  preAlbum.push(files[0]);
                                  return preAlbum;
                                });
                                onChange(files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CreateEventSection>
              <Separator className="mt-5 mb-6" />
              <CreateEventSection
                icon={<LuMapPin />}
                title="Địa điểm và thời gian"
              >
                <Form {...addressForm}>
                  <form
                    onSubmit={addressForm.handleSubmit(() => {})}
                    className="mt-8 flex flex-col gap-8"
                  >
                    <div>
                      <h6 className="text-xl font-bold">Địa điểm</h6>
                      <p className="text-sm text-neutral-550 my-2">
                        Chọn địa điểm tổ chức sự kiện
                      </p>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={addressForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Địa điểm
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Địa chỉ"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Quận / Huyện
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn quận / huyện" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent
                                  className={cn(
                                    districts &&
                                      districts.length > 0 &&
                                      'h-[30vh]'
                                  )}
                                >
                                  <SelectGroup>
                                    {districts?.map(district => (
                                      <SelectItem
                                        key={district.code}
                                        value={district.code}
                                      >
                                        {district.name_with_type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Tỉnh / Thành phố
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tỉnh / thành phố" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="h-[30vh]">
                                  <SelectGroup>
                                    {provinces?.map(province => (
                                      <SelectItem
                                        key={province.code}
                                        value={province.code}
                                      >
                                        {province.name_with_type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <h6 className="text-xl font-bold">Thời gian</h6>
                      <p className="text-sm text-neutral-550 my-2">
                        Chọn thời gian bắt đầu và thời gian kết thúc cho sự kiện
                        của bạn
                      </p>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={addressForm.control}
                          name="eventDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Ngày tổ chức sự kiện
                              </FormLabel>
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
                                        <span>Chọn ngày tổ chức sự kiện</span>
                                      )}
                                      <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    locale={vi}
                                    lang="vi"
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={date =>
                                      date < new Date('1900-01-01')
                                    }
                                    fromYear={1900}
                                    toYear={new Date().getFullYear() + 2}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-9 items-center">
                          <div className="w-1/2">
                            <FormField
                              control={addressForm.control}
                              name="startTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold">
                                    Thời gian bắt đầu
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={'outline'}
                                          className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, 'HH:mm')
                                          ) : (
                                            <span>Chọn thời gian bắt đầu</span>
                                          )}
                                          <LuClock className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-4"
                                      align="start"
                                    >
                                      <TimePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-1/2">
                            <FormField
                              control={addressForm.control}
                              name="endTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold">
                                    Thời gian kết thúc
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={'outline'}
                                          className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground'
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, 'HH:mm')
                                          ) : (
                                            <span>Chọn thời gian kết thúc</span>
                                          )}
                                          <LuClock className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-4"
                                      align="start"
                                    >
                                      <TimePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CreateEventSection>
              <Separator className="mt-5 mb-6" />
              <CreateEventSection icon={<LuTicket />} title="Thông tin vé">
                <Form {...ticketInfoForm}>
                  <form
                    onSubmit={ticketInfoForm.handleSubmit(() => {})}
                    className="mt-8"
                  >
                    <FormField
                      control={ticketInfoForm.control}
                      name="isPaid"
                      defaultValue="paid"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <RadioGroup
                          defaultValue="paid"
                          onValueChange={value => {
                            onChange(value);
                            if (value === 'free') {
                              ticketInfoForm.setValue('price', '0');
                            }
                          }}
                          value={value}
                          className="flex items-center gap-8 mb-4"
                        >
                          <FormItem className="w-1/2">
                            <FormLabel
                              className={cn(
                                'flex items-center gap-2 w-full space-y-0 py-5 px-4 border border-solid rounded-m border-neutral-300 cursor-pointer',
                                value === 'paid' &&
                                  'bg-primary-100 border-primary-500'
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem value="paid" />
                              </FormControl>
                              Trả phí
                            </FormLabel>
                          </FormItem>
                          <FormItem className="w-1/2">
                            <FormLabel
                              className={cn(
                                'flex items-center gap-2 w-full space-y-0 py-5 px-4 border border-solid rounded-m border-neutral-300 cursor-pointer',
                                value === 'free' &&
                                  'bg-primary-100 border-primary-500'
                              )}
                            >
                              <FormControl>
                                <RadioGroupItem value="free" />
                              </FormControl>
                              Miễn phí
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      )}
                    />
                    <div className="flex gap-8 items-center mb-8">
                      <div className="w-1/2">
                        <FormField
                          control={ticketInfoForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <span className="text-sm font-bold">
                                  Số lượng
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder="Nhập số lượng vé"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-1/2">
                        <FormField
                          control={ticketInfoForm.control}
                          name="price"
                          disabled={ticketInfoForm.watch().isPaid === 'free'}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <span className="text-sm font-bold">
                                  Giá vé (VNĐ)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  placeholder="Nhập giá vé"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <h6 className="text-xl font-bold">Thời gian bán vé</h6>
                      <p className="text-sm text-neutral-550 my-2">
                        Đặt thời gian khi khán giả có thể bắt đầu mua vé
                      </p>
                      <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-2">
                        <FormField
                          control={ticketInfoForm.control}
                          name="ticketStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Ngày bắt đầu
                              </FormLabel>
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
                                        <span>Chọn ngày bắt đầu mua vé</span>
                                      )}
                                      <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    locale={vi}
                                    lang="vi"
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={date =>
                                      date < new Date('1900-01-01')
                                    }
                                    fromYear={1900}
                                    toYear={new Date().getFullYear() + 2}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={ticketInfoForm.control}
                          name="ticketStartTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Giờ mở cửa
                              </FormLabel>
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
                                        format(field.value, 'HH:mm')
                                      ) : (
                                        <span>Chọn thời gian mở cửa</span>
                                      )}
                                      <LuClock className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-4"
                                  align="start"
                                >
                                  <TimePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={ticketInfoForm.control}
                          name="ticketCloseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Ngày kết thúc
                              </FormLabel>
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
                                        <span>Chọn ngày kết thúc mua vé</span>
                                      )}
                                      <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    locale={vi}
                                    lang="vi"
                                    mode="single"
                                    captionLayout="dropdown-buttons"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={date =>
                                      date < new Date('1900-01-01')
                                    }
                                    fromYear={1900}
                                    toYear={new Date().getFullYear() + 2}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={ticketInfoForm.control}
                          name="ticketCloseTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold">
                                Giờ đóng cửa
                              </FormLabel>
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
                                        format(field.value, 'HH:mm')
                                      ) : (
                                        <span>Chọn thời gian đóng cửa</span>
                                      )}
                                      <LuClock className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-4"
                                  align="start"
                                >
                                  <TimePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="my-8">
                      <FormField
                        control={ticketInfoForm.control}
                        name="isPromotion"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem className="flex items-center gap-4">
                            <FormLabel>
                              <h6 className="text-xl font-bold">Khuyến mãi</h6>
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={value}
                                onCheckedChange={onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {ticketInfoForm.watch().isPromotion && (
                        <FormField
                          control={ticketInfoForm.control}
                          name="promotionPlan"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-4 mt-8">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Nhập khuyến mãi (%)"
                                  max={100}
                                  min={0}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </form>
                </Form>
              </CreateEventSection>
            </>
          )}
          {step === 2 && (
            <>
              <span
                className="text-neutral-500 flex gap-[6px] items-center py-4 cursor-pointer hover:text-neutral-600"
                onClick={() => setStep(1)}
              >
                <LuArrowLeft /> Thông tin sự kiện
              </span>

              <CreateEventSection icon={<LuImage />} title="Xem trước">
                <div className="mt-5 mb-9">
                  <SearchEventCard
                    event={{
                      ticketPrice: ticketInfoForm.watch().price || 0,
                      promotionPlan: ticketInfoForm.watch().promotionPlan || 0,
                      coverImage: coverImagePreview || '',
                      name: generalInfoForm.watch().name,
                      eventDate: concatDateWithTime(
                        addressForm.watch().eventDate,
                        addressForm.watch().startTime
                      ),
                      location: `${addressForm.watch().address} - ${
                        addressForm.watch().district
                      } - ${addressForm.watch().province}}`
                    }}
                  />
                </div>
                <Form {...publishForm}>
                  <form
                    onSubmit={publishForm.handleSubmit(() => {})}
                    className="mt-8"
                  >
                    <div>
                      <FormField
                        control={publishForm.control}
                        name="isPublish"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem className="flex items-center gap-4">
                            <FormLabel>
                              <h6 className="text-xl font-bold">
                                Lịch xuất bản
                              </h6>
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={value}
                                onCheckedChange={onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <p className="text-sm text-neutral-550 my-2">
                        Đặt thời gian xuất bản để đảm bảo sự kiện của bạn xuất
                        hiện trên trang web vào thời gian được chỉ định
                      </p>
                      {publishForm.watch().isPublish && (
                        <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-2">
                          <FormField
                            control={publishForm.control}
                            name="publishDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold">
                                  Ngày xuất bản
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-full pl-3 text-left font-normal',
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, 'dd/MM/yyyy')
                                        ) : (
                                          <span>
                                            Chọn ngày xuất bản sự kiện
                                          </span>
                                        )}
                                        <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      locale={vi}
                                      lang="vi"
                                      mode="single"
                                      captionLayout="dropdown-buttons"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={date =>
                                        date < new Date('1900-01-01')
                                      }
                                      fromYear={1900}
                                      toYear={new Date().getFullYear() + 2}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={publishForm.control}
                            name="publishTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-bold">
                                  Thời gian xuất bản
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-full pl-3 text-left font-normal',
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, 'HH:mm')
                                        ) : (
                                          <span>
                                            Chọn thời gian xuất bản sự kiện
                                          </span>
                                        )}
                                        <LuClock className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-4"
                                    align="start"
                                  >
                                    <TimePicker
                                      date={field.value}
                                      setDate={field.onChange}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </form>
                </Form>
              </CreateEventSection>
            </>
          )}
          <Separator className="mb-6 mt-8" />
          <div className="flex items-center justify-between">
            <Button
              type="reset"
              className="bg-neutral-200 text-neutral-600 text-sm gap-[6px] hover:bg-neutral-300"
            >
              <LuX /> Hủy
            </Button>
            {step === 1 && (
              <Button
                type="button"
                className="text-white gap-[6px]"
                onClick={() => {
                  Promise.all([
                    uploadCoverImageForm.trigger(),
                    generalInfoForm.trigger(),
                    addressForm.trigger(),
                    ticketInfoForm.trigger()
                  ])
                    .then(response => {
                      if (response.includes(false)) throw Error();
                      setStep(2);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }}
              >
                Tiếp theo <LuArrowRight />
              </Button>
            )}
            {step === 2 && (
              <Button
                type="submit"
                className="text-white gap-[6px]"
                onClick={handleCreateEvent}
                loading={isLoading}
              >
                <LuCheck /> Xuất bản
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CreateEventPage.Layout = OrganizerLayout;

export default CreateEventPage;
