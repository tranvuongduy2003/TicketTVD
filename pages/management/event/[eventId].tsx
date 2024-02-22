import { eventApi, fileApi } from '@/apis';
import { CreateEventSection, SearchEventCard } from '@/components/event';
import { AdminLayout } from '@/components/layout';
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
import { useAuth, useCategories, useEvent } from '@/hooks';
import {
  CreateEventPayload,
  District,
  NextPageWithLayout,
  Tree
} from '@/models';
import { cn } from '@/types';
import {
  compressFile,
  concatDateWithTime,
  convertToISODate,
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

const AdminEventDetailPage: NextPageWithLayout = () => {
  const { categories } = useCategories();
  const { profile } = useAuth();

  const router = useRouter();
  const { eventId } = router.query;

  const { event, isLoading: eventLoading } = useEvent(eventId as string);

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>('');
  const [coverImage, setCoverImage] = useState<File | null>();
  const [albumPreview, setAlbumPreview] = useState<string[]>([]);
  const [album, setAlbum] = useState<File[]>([]);
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
              getFile(event.coverImage).then(({ data: coverImageFile }) => {
                setCoverImage(coverImageFile);
              }),
            event.album &&
              event.album.length > 0 &&
              Promise.all(
                event.album.map(async item => {
                  const { data } = await getFile(item);
                  return data;
                })
              ).then(albumFiles => {
                setAlbum(albumFiles);
              })
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
            startTime: event.startTime
          });
          await addressForm.trigger();

          ticketInfoForm.reset({
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

      const data: CreateEventPayload = {
        coverImage: coverImagePreview!,
        name: name,
        description: description,
        categoryId: categoryId,
        location: `${address}, ${tree
          ?.find(item => item.code === province?.code)
          ?.quan_huyen.find(item => item.code === district)?.path_with_type}`,
        startTime: convertToISODate(startTime),
        endTime: convertToISODate(endTime),
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
        album: albumPreview,
        creatorId: profile!.id
      };

      // Upload cover image
      if (coverImage) {
        const compressedCoverImage = await compressFile(coverImage);
        const { data: coverImageUrl } =
          await fileApi.uploadFile(compressedCoverImage);
        data.coverImage = coverImageUrl!.blob.uri;
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
                    const { data: coverImageUrl } =
                      await fileApi.uploadFile(compressedCoverImage);
                    resolve(coverImageUrl!.blob.uri);
                  }
                } catch (error) {
                  reject(error);
                }
              })
          )
        );
        data.album = albumUrls;
      }

      await eventApi.updateEvent(eventId as string, data);

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
        <span
          className="flex item-center gap-2 text-neutral-550 leading-none mb-5 hover:text-neutral-700 cursor-pointer"
          onClick={() => router.back()}
        >
          <LuArrowLeft /> Quay lại
        </span>
        {/* HEADER */}
        <h2 className="text-[32px] font-bold leading-[48px] mb-8">
          Chỉnh sửa thông tin sự kiện
        </h2>

        {/* CONTENT */}
        <div>
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
                            const { files, displayUrl } = getImageData(event);
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
          <CreateEventSection icon={<LuAlertCircle />} title="Thông tin chung">
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
                        <Textarea placeholder="Nhập mô tả sự kiện" {...field} />
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
                    <FormItem defaultValue={JSON.stringify(event.categoryId)}>
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
                            <p className="break-all">{getFileName(item)}</p>
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
                            const { files, displayUrl } = getImageData(event);
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
          <CreateEventSection icon={<LuMapPin />} title="Địa điểm và thời gian">
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
                            const words = event?.location?.split(', ') || [];
                            return (
                              item.name_with_type === words[words.length - 1]
                            );
                          })
                          ?.quan_huyen.find(item => {
                            const words = event?.location?.split(', ') || [];
                            return (
                              item.name_with_type === words[words.length - 2]
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
                                  ? province?.quan_huyen?.map(district => (
                                      <SelectItem
                                        key={district.code}
                                        value={district.code}
                                      >
                                        {district.name_with_type}
                                      </SelectItem>
                                    ))
                                  : tree
                                      ?.find(item => {
                                        const words =
                                          event?.location?.split(', ') || [];
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
                          const words = event?.location?.split(', ') || [];
                          return (
                            item.name_with_type === words[words.length - 1]
                          );
                        })?.code
                      }
                      render={({ field }) => (
                        <FormItem
                          defaultValue={
                            tree?.find(item => {
                              const words = event?.location?.split(', ') || [];
                              return (
                                item.name_with_type === words[words.length - 1]
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
                    Chọn thời gian bắt đầu và thời gian kết thúc cho sự kiện của
                    bạn
                  </p>
                  <div className="flex flex-col gap-2">
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
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value ? (
                                        format(new Date(field.value), 'HH:mm')
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
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value ? (
                                        format(new Date(field.value), 'HH:mm')
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
                  defaultValue={event.ticketPrice === 0 ? 'free' : 'paid'}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <RadioGroup
                      defaultValue={event.ticketPrice === 0 ? 'free' : 'paid'}
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
                            <span className="text-sm font-bold">Số lượng</span>
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
                        <FormItem defaultValue={event.ticketStartTime as any}>
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
                                    format(new Date(field.value), 'dd/MM/yyyy')
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
                                disabled={date => date < new Date('1900-01-01')}
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
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), 'HH:mm', {
                                      locale: vi
                                    })
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
                          defaultValue={JSON.stringify(event.ticketCloseTime)}
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
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), 'dd/MM/yyyy')
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
                                disabled={date => date < new Date('1900-01-01')}
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
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), 'HH:mm', {
                                      locale: vi
                                    })
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
                          <h6 className="text-xl font-bold">Khuyến mãi</h6>
                        </FormLabel>
                        <FormControl>
                          <Switch checked={value} onCheckedChange={onChange} />
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
          <CreateEventSection icon={<LuImage />} title="Xem trước">
            <div className="mt-5 mb-9">
              <SearchEventCard
                event={{
                  category: categories?.find(
                    item => item.id === event.categoryId
                  ),
                  ticketPrice: ticketInfoForm.watch().price || 0,
                  promotionPlan: ticketInfoForm.watch().promotionPlan || 0,
                  coverImage: coverImagePreview || '',
                  name: generalInfoForm.watch().name,
                  location: `${
                    addressForm.watch().address
                  }, ${province?.quan_huyen?.find(
                    item => item.code === addressForm.watch().district
                  )?.path_with_type}`
                }}
              />
            </div>
          </CreateEventSection>

          <Separator className="mb-6 mt-8" />
          <div className="flex items-center justify-between">
            <Button
              type="reset"
              className="bg-neutral-200 text-neutral-600 text-sm gap-[6px] hover:bg-neutral-300"
            >
              <LuX /> Quay lại
            </Button>
            <Button
              type="button"
              className="text-white gap-[6px]"
              onClick={handleUpdateEvent}
              loading={isLoading}
            >
              <LuCheck /> Cập nhật
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

AdminEventDetailPage.Layout = AdminLayout;

export default AdminEventDetailPage;
