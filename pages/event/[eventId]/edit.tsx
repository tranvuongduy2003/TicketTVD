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
  Loading,
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
import { useCategories, useEvent } from '@/hooks';
import { District, Event, NextPageWithLayout, Tree } from '@/models';
import { cn } from '@/types';
import {
  compressFile,
  concatDateWithTime,
  convertToISODate,
  formatDate,
  getFile,
  getFileName,
  getImageData
} from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
  album: z.any().optional()
});

const addressFormSchema = z.object({
  address: z.string({ required_error: 'Vui lòng nhập địa chỉ' }),
  district: z.string({ required_error: 'Vui lòng chọn quận / huyện' }),
  province: z.string({ required_error: 'Vui lòng chọn tỉnh / thành phố' }),
  eventDate: z.any({ required_error: 'Vui lòng chọn ngày tổ chức sự kiện' }),
  startTime: z.any({
    required_error: 'Vui lòng chọn thời gian bắt đầu sự kiện'
  }),
  endTime: z.any({
    required_error: 'Vui lòng chọn thời gian kết thúc sự kiện'
  })
});

const ticketInfoFormSchema = z.object({
  isPaid: z.string(),
  quantity: z.coerce.number({ required_error: 'Vui lòng nhập số lượng vé' }),
  price: z.any().optional(),
  ticketStartDate: z.any({
    required_error: 'Vui lòng chọn ngày mở bán vé'
  }),
  ticketStartTime: z.any({
    required_error: 'Vui lòng chọn thời gian mở bán vé'
  }),
  ticketCloseDate: z.any({
    required_error: 'Vui lòng chọn ngày đóng bán vé'
  }),
  ticketCloseTime: z.any({
    required_error: 'Vui lòng chọn thời gian đóng bán vé'
  }),
  isPromotion: z.boolean().default(false),
  promotionPlan: z.any().optional()
});

const publishFormSchema = z.object({
  isPublish: z.boolean().default(false),
  publishTime: z.date().optional(),
  publishDate: z.date().optional()
});

const EditEventPage: NextPageWithLayout = () => {
  const { categories } = useCategories();

  const { query } = useRouter();
  const { eventId } = query;

  const { event, isLoading: eventLoading } = useEvent(
    Number.parseInt(eventId as string)
  );

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>('');
  const [coverImage, setCoverImage] = useState<File | null>();
  const [albumPreview, setAlbumPreview] = useState<string[]>([]);
  const [album, setAlbum] = useState<File[]>([]);
  const [step, setStep] = useState<number>(1);
  const [tree, setTree] = useState<Tree[]>();
  const [province, setProvince] = useState<Tree>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsFileLoading(true);
      try {
        if (event) {
          setCoverImagePreview(event.coverImage);
          setAlbumPreview(event.album);
          await Promise.all([
            event.coverImage &&
              getFile(event.coverImage).then(coverImageFile => {
                setCoverImage(coverImageFile);
              }),
            event.album &&
              event.album.length > 0 &&
              Promise.all(event.album.map(item => getFile(item))).then(
                albumFiles => {
                  setAlbum(albumFiles);
                }
              )
          ]);
        }
        setIsFileLoading(false);
      } catch (error) {
        console.log(error);
        setIsFileLoading(false);
      }
    })();
  }, [event]);

  const uploadCoverImageForm = useForm<
    z.infer<typeof uploadCoverImageFormSchema>
  >({
    mode: 'onChange'
  });

  const generalInfoForm = useForm<z.infer<typeof generalInfoFormSchema>>({
    resolver: zodResolver(generalInfoFormSchema),
    mode: 'onChange'
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    mode: 'onChange'
  });

  const ticketInfoForm = useForm<z.infer<typeof ticketInfoFormSchema>>({
    resolver: zodResolver(ticketInfoFormSchema),
    mode: 'onChange'
  });

  const publishForm = useForm<z.infer<typeof publishFormSchema>>({
    resolver: zodResolver(publishFormSchema),
    mode: 'onChange'
  });

  const handleFetchProvinces = useRef<any>(null);

  useEffect(() => {
    handleFetchProvinces.current = async () => {
      try {
        fetch('/data/tree.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
          .then(function (response) {
            return response.json();
          })
          .then(treeData => {
            if (event) {
              const words = event.location?.split(', ') || [];
              const province = treeData?.find((item: Tree) => {
                return item.name_with_type === words[words.length - 1];
              });
              const district = province?.quan_huyen.find((item: District) => {
                return item.name_with_type === words[words.length - 2];
              });

              addressForm.reset({
                address: words[0],
                province: province?.code as string,
                district: district?.code as string
              });
            }
            setTree(treeData);
          });
      } catch (error) {
        console.log(error);
      }
    };
    handleFetchProvinces.current();
    () => handleFetchProvinces.current;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (event) {
          uploadCoverImageForm.reset({
            coverImage: event.coverImage
          });

          generalInfoForm.reset({
            album: event.album,
            categoryId: JSON.stringify(event.categoryId),
            description: event.description,
            name: event.name
          });

          const words = event.location?.split(', ') || [];
          const province = tree?.find((item: Tree) => {
            return item.name_with_type === words[words.length - 1];
          });
          const district = province?.quan_huyen.find((item: District) => {
            return item.name_with_type === words[words.length - 2];
          });
          addressForm.reset({
            address: words[0] as string,
            province: province?.code as string,
            district: district?.code as string,
            endTime: event.endTime,
            startTime: event.startTime,
            eventDate: event.eventDate
          });
          await addressForm.trigger();

          ticketInfoForm.reset({
            isPaid: event.ticketIsPaid === false ? 'free' : 'paid',
            quantity: event.ticketQuantity || 0,
            price: event.ticketPrice,
            ticketStartDate: event.ticketStartTime,
            ticketStartTime: event.ticketStartTime,
            ticketCloseDate: event.ticketCloseTime,
            ticketCloseTime: event.ticketCloseTime,
            isPromotion: event.isPromotion,
            promotionPlan: event.promotionPlan
          });
          await ticketInfoForm.trigger();

          publishForm.reset({
            isPublish: event.publishTime ? true : false
          });
          if (event.publishTime) {
            publishForm.reset({
              publishDate: event.publishTime,
              publishTime: event.publishTime
            });
          }
          await publishForm.trigger();
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [event]);

  useEffect(() => {
    if (tree) {
      setProvince(
        tree.find(item => {
          const words = event?.location?.split(', ') || [];
          return item.name_with_type === words[words.length - 1];
        })
      );
    }
  }, [event?.location, tree]);

  useEffect(() => {
    setProvince(
      tree?.find(item => {
        return item.code === addressForm.watch().province;
      })
    );
  }, [addressForm.watch().province]);

  async function handleUpdateEvent() {
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

      const data: Partial<Event> = {
        coverImage: coverImagePreview!,
        name: name,
        description: description,
        categoryId: Number.parseInt(categoryId),
        location: `${address}, ${tree
          ?.find(item => item.code === province?.code)
          ?.quan_huyen.find(item => item.code === district)?.path_with_type}`,
        eventDate: concatDateWithTime(new Date(eventDate), new Date(startTime)),
        startTime: convertToISODate(startTime),
        endTime: convertToISODate(endTime),
        ticketIsPaid: isPaid === 'paid' ? true : false,
        ticketQuantity: quantity,
        ticketPrice: Number.parseInt(price),
        ticketStartTime: concatDateWithTime(
          new Date(ticketStartDate),
          new Date(ticketStartTime)
        ),
        ticketCloseTime: concatDateWithTime(
          new Date(ticketCloseDate),
          new Date(ticketCloseTime)
        ),
        isPromotion: isPromotion,
        promotionPlan: isPromotion ? Number.parseInt(promotionPlan) : 0,
        album: albumPreview
      };

      if (isPublish && publishDate && publishTime) {
        data.publishTime = concatDateWithTime(
          new Date(publishDate),
          new Date(publishTime)
        );
      }

      // Upload cover image
      if (coverImage) {
        const compressedCoverImage = await compressFile(coverImage);
        const coverImageUrl = await fileApi.uploadFile(compressedCoverImage);
        data.coverImage = coverImageUrl.blob.uri;
      }
      // Upload albums
      if (album && album.length > 0 && !album.some(item => !item)) {
        const albumUrls = await Promise.all(
          album.map(
            async item =>
              new Promise<string>(async (resolve, reject) => {
                try {
                  if (item) {
                    const compressedCoverImage = await compressFile(item);
                    const coverImageUrl =
                      await fileApi.uploadFile(compressedCoverImage);
                    resolve(coverImageUrl.blob.uri);
                  }
                } catch (error) {
                  reject(error);
                }
              })
          )
        );
        data.album = albumUrls;
      }

      await eventApi.updateEvent(Number.parseInt(eventId as string), data);

      setIsLoading(false);
      toast({
        title: 'Cập nhật sự kiện mới thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.5
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: 'Cập nhật sự kiện mới thất bại',
        description: JSON.stringify(error),
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return eventLoading || !event || !tree ? (
    <Loading />
  ) : (
    event && (
      <div className="mx-[132px] my-[34px]">
        {/* HEADER */}
        <h2 className="text-[32px] font-bold leading-[48px] mb-8">
          Chỉnh sửa thông tin sự kiện
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
                  {event?.updatedAt && formatDate(new Date(event?.updatedAt))}
                </p>
                <h5 className="text-neutral-550 leading-[26px] mb-2">
                  Trạng thái
                </h5>
                <p className="font-bold leading-[26px]">Chỉnh sửa</p>
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
                    Tải lên ảnh bìa sự kiện để thu hút sự chú ý của người tham
                    gia
                  </p>
                  <Form {...uploadCoverImageForm}>
                    <form
                      onSubmit={uploadCoverImageForm.handleSubmit(() => {})}
                    >
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
                                {getFileName(coverImagePreview!)}
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
                        defaultValue={JSON.stringify(event.categoryId)}
                        render={({ field }) => (
                          <FormItem
                            defaultValue={JSON.stringify(event.categoryId)}
                          >
                            <FormLabel>
                              <span className="text-xl font-bold">
                                Thể loại
                              </span>
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
                                    {getFileName(item)}
                                  </p>
                                </div>
                              ))}
                              {albumPreview && albumPreview.length < 5 && (
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
                    <form className="mt-8 flex flex-col gap-8">
                      <div>
                        <h6 className="text-xl font-bold">Địa điểm</h6>
                        <p className="text-sm text-neutral-550 my-2">
                          Chọn địa điểm tổ chức sự kiện
                        </p>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={addressForm.control}
                            name="address"
                            defaultValue={event?.location?.split(', ')[0]}
                            render={({ field }) => (
                              <FormItem
                                defaultValue={event?.location?.split(', ')[0]}
                              >
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
                            defaultValue={
                              tree
                                ?.find(item => {
                                  const words =
                                    event?.location?.split(', ') || [];
                                  return (
                                    item.name_with_type ===
                                    words[words.length - 1]
                                  );
                                })
                                ?.quan_huyen.find(item => {
                                  const words =
                                    event?.location?.split(', ') || [];
                                  return (
                                    item.name_with_type ===
                                    words[words.length - 2]
                                  );
                                })?.code
                            }
                            render={({ field }) => (
                              <FormItem
                                defaultValue={
                                  tree
                                    ?.find(item => {
                                      const words =
                                        event?.location?.split(', ') || [];
                                      return (
                                        item.name_with_type ===
                                        words[words.length - 1]
                                      );
                                    })
                                    ?.quan_huyen.find(item => {
                                      const words =
                                        event?.location?.split(', ') || [];
                                      return (
                                        item.name_with_type ===
                                        words[words.length - 2]
                                      );
                                    })?.code
                                }
                              >
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
                                      (!province && tree) ||
                                        (province?.quan_huyen &&
                                          province?.quan_huyen.length > 0 &&
                                          'h-[30vh]')
                                    )}
                                  >
                                    <SelectGroup>
                                      {province &&
                                      province.quan_huyen &&
                                      province.quan_huyen.length > 0
                                        ? province?.quan_huyen?.map(
                                            district => (
                                              <SelectItem
                                                key={district.code}
                                                value={district.code}
                                              >
                                                {district.name_with_type}
                                              </SelectItem>
                                            )
                                          )
                                        : tree
                                            ?.find(item => {
                                              const words =
                                                event?.location?.split(', ') ||
                                                [];
                                              return (
                                                item.name_with_type ===
                                                words[words.length - 1]
                                              );
                                            })
                                            ?.quan_huyen.map(district => (
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
                            defaultValue={
                              tree?.find(item => {
                                const words =
                                  event?.location?.split(', ') || [];
                                return (
                                  item.name_with_type ===
                                  words[words.length - 1]
                                );
                              })?.code
                            }
                            render={({ field }) => (
                              <FormItem
                                defaultValue={
                                  tree?.find(item => {
                                    const words =
                                      event?.location?.split(', ') || [];
                                    return (
                                      item.name_with_type ===
                                      words[words.length - 1]
                                    );
                                  })?.code
                                }
                              >
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
                                      {tree?.map(province => (
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
                          Chọn thời gian bắt đầu và thời gian kết thúc cho sự
                          kiện của bạn
                        </p>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={addressForm.control}
                            name="eventDate"
                            defaultValue={event.eventDate}
                            render={({ field }) => (
                              <FormItem defaultValue={event.eventDate as any}>
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
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            'dd/MM/yyyy'
                                          )
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
                                {...(event.startTime
                                  ? { defaultValue: event.startTime }
                                  : {})}
                                render={({ field }) => (
                                  <FormItem
                                    {...(event.startTime
                                      ? { defaultValue: event.startTime as any }
                                      : {})}
                                  >
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
                                              format(
                                                new Date(field.value),
                                                'HH:mm'
                                              )
                                            ) : (
                                              <span>
                                                Chọn thời gian bắt đầu
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
                            <div className="w-1/2">
                              <FormField
                                control={addressForm.control}
                                name="endTime"
                                {...(event.endTime
                                  ? { defaultValue: event.endTime }
                                  : {})}
                                render={({ field }) => (
                                  <FormItem
                                    {...(event.endTime
                                      ? { defaultValue: event.endTime as any }
                                      : {})}
                                  >
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
                                              format(
                                                new Date(field.value),
                                                'HH:mm'
                                              )
                                            ) : (
                                              <span>
                                                Chọn thời gian kết thúc
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
                        defaultValue={
                          event.ticketIsPaid === false ? 'free' : 'paid'
                        }
                        render={({ field: { onChange, value, ...rest } }) => (
                          <RadioGroup
                            defaultValue={
                              event.ticketIsPaid === false ? 'free' : 'paid'
                            }
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
                            defaultValue={event.ticketQuantity}
                            render={({ field }) => (
                              <FormItem defaultValue={event.ticketQuantity}>
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
                            defaultValue={JSON.stringify(event.ticketPrice)}
                            disabled={ticketInfoForm.watch().isPaid === 'free'}
                            render={({ field }) => (
                              <FormItem
                                defaultValue={JSON.stringify(event.ticketPrice)}
                              >
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
                            defaultValue={event.ticketStartTime}
                            render={({ field }) => (
                              <FormItem
                                defaultValue={event.ticketStartTime as any}
                              >
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
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            'dd/MM/yyyy'
                                          )
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
                            {...(event.ticketStartTime
                              ? { defaultValue: event.ticketStartTime }
                              : {})}
                            render={({ field }) => (
                              <FormItem
                                {...(event.ticketStartTime
                                  ? {
                                      defaultValue: event.ticketStartTime as any
                                    }
                                  : {})}
                              >
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
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            'HH:mm',
                                            { locale: vi }
                                          )
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
                            defaultValue={event.ticketCloseTime}
                            render={({ field }) => (
                              <FormItem
                                defaultValue={JSON.stringify(
                                  event.ticketCloseTime
                                )}
                              >
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
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            'dd/MM/yyyy'
                                          )
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
                            {...(event.ticketCloseTime
                              ? { defaultValue: event.ticketCloseTime }
                              : {})}
                            render={({ field }) => (
                              <FormItem
                                {...(event.ticketCloseTime
                                  ? {
                                      defaultValue: event.ticketCloseTime as any
                                    }
                                  : {})}
                              >
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
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value ? (
                                          format(
                                            new Date(field.value),
                                            'HH:mm',
                                            { locale: vi }
                                          )
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
                          defaultValue={event.isPromotion}
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem
                              className="flex items-center gap-4"
                              defaultValue={event.isPromotion as any}
                            >
                              <FormLabel>
                                <h6 className="text-xl font-bold">
                                  Khuyến mãi
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
                        {ticketInfoForm.watch().isPromotion && (
                          <FormField
                            control={ticketInfoForm.control}
                            name="promotionPlan"
                            defaultValue={event.promotionPlan}
                            render={({ field }) => (
                              <FormItem
                                className="flex items-center gap-4 mt-8"
                                defaultValue={event.promotionPlan}
                              >
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
                        category: categories?.find(
                          item => item.id === event.categoryId
                        ),
                        ticketPrice: ticketInfoForm.watch().price || 0,
                        promotionPlan:
                          ticketInfoForm.watch().promotionPlan || 0,
                        coverImage: coverImagePreview || '',
                        name: generalInfoForm.watch().name,
                        eventDate: concatDateWithTime(
                          new Date(addressForm.watch().eventDate),
                          new Date(addressForm.watch().startTime)
                        ),
                        location: `${
                          addressForm.watch().address
                        }, ${province?.quan_huyen?.find(
                          item => item.code === addressForm.watch().district
                        )?.path_with_type}`
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
                          defaultValue={event.publishTime ? true : false}
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem
                              className="flex items-center gap-4"
                              defaultValue={
                                (event.publishTime ? true : false) as any
                              }
                            >
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
                        {(event.publishTime ||
                          publishForm.watch().isPublish === true) && (
                          <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-2">
                            <FormField
                              control={publishForm.control}
                              name="publishDate"
                              defaultValue={event.publishTime}
                              render={({ field }) => (
                                <FormItem
                                  defaultValue={event.publishTime as any}
                                >
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
                                            format(
                                              new Date(field.value),
                                              'dd/MM/yyyy'
                                            )
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
                              {...(event.publishTime
                                ? { defaultValue: event.publishTime }
                                : {})}
                              render={({ field }) => (
                                <FormItem
                                  {...(event.publishTime
                                    ? { defaultValue: event.publishTime as any }
                                    : {})}
                                >
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
                                            format(
                                              new Date(field.value),
                                              'HH:mm'
                                            )
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
                  type="button"
                  className="text-white gap-[6px]"
                  onClick={handleUpdateEvent}
                  loading={isLoading}
                >
                  <LuCheck /> Cập nhật
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

EditEventPage.Layout = OrganizerLayout;

export default EditEventPage;
