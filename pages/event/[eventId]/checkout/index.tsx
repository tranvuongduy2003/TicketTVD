import { paymentApi } from '@/apis';
import { DetailItem } from '@/components/event';
import { CustomerLayout } from '@/components/layout';
import { TicketForm } from '@/components/ticket';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Loading,
  Separator,
  toast
} from '@/components/ui';
import { MILLISECOND_PER_SECOND, PHONE_REGEX } from '@/constants';
import { useAuth, useEvent } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { CheckoutPayload, CreateStripeSessionPayload } from '@/types';
import { formatDateToLocaleDate, formatDateToTime } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LuArrowLeft,
  LuCalendar,
  LuMapPin,
  LuMinus,
  LuPlus
} from 'react-icons/lu';
import * as z from 'zod';

const contactFormSchema = z.object({
  fullname: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }),
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .max(100, { message: 'Email không được vượt quá 100 kí tự' })
    .email('Email không hợp lệ'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
    .max(100, { message: 'Số điện thoại không được vượt quá 100 kí tự' })
});

const ticketFormSchema = z.object({
  fullname: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }),
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .max(100, { message: 'Email không được vượt quá 100 kí tự' })
    .email('Email không hợp lệ'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
    .max(100, { message: 'Số điện thoại không được vượt quá 100 kí tự' })
});

const EventDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { event, isLoading } = useEvent(eventId as string);
  const { profile } = useAuth();

  const [quantity, setQuantity] = useState<number>(0);

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange'
  });

  const ticketForm = useForm<{ tickets: z.infer<typeof ticketFormSchema>[] }>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      tickets: []
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (profile) {
      contactForm.reset({
        fullname: profile.name,
        email: profile.email,
        phone: profile.phoneNumber
      });
    }
  }, [profile]);

  function handleDecreaseQuantity() {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      const tickets = ticketForm.watch().tickets;
      tickets.pop();
      ticketForm.setValue('tickets', tickets);
    }
  }

  function handleIncreaseQuantity() {
    if (quantity < (event?.ticketQuantity || 0)) {
      setQuantity(quantity + 1);
      const tickets = ticketForm.watch().tickets;
      tickets.push({
        email: '',
        fullname: '',
        phone: ''
      });
      ticketForm.setValue('tickets', tickets);
    }
  }

  function validateForms() {
    return Promise.all([contactForm.trigger(), ticketForm.trigger()])
      .then(response => {
        if (response.includes(false)) throw Error();
        return response;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  async function handleCheckout() {
    try {
      await validateForms();

      const { email, fullname, phone } = contactForm.getValues();
      const { tickets } = ticketForm.getValues();

      const payload: CheckoutPayload = {
        userId: profile?.id as string,
        tickets:
          tickets?.map(item => ({
            ownerName: item.fullname,
            ownerEmail: item.email,
            ownerPhone: item.phone,
            eventId: eventId as string,
            closeTime: event?.ticketCloseTime as Date,
            startTime: event?.ticketStartTime as Date,
            price: event?.ticketPrice as number
          })) || [],
        discount: event?.promotionPlan || 0,
        eventId: eventId as string,
        quantity: quantity,
        totalPrice:
          (event?.ticketPrice || 0) *
          quantity *
          (1 - 0.01 * (event?.promotionPlan || 0)),
        contactInfo: {
          email: email,
          fullName: fullname,
          phoneNumber: phone
        }
      };

      const { data: payment } = await paymentApi.checkout(payload);

      if (payment) {
        const route = window.location.href;

        const stripePayload: CreateStripeSessionPayload = {
          approvedUrl: route + '/confirmation?paymentId=' + payment.id,
          cancelUrl: route,
          paymentId: payment.id,
          tickets:
            tickets?.map(item => ({
              ownerName: item.fullname,
              ownerEmail: item.email,
              ownerPhone: item.phone,
              eventId: eventId as string,
              closeTime: event?.ticketCloseTime as Date,
              startTime: event?.ticketStartTime as Date,
              price: event?.ticketPrice as number
            })) || []
        };

        const { data: stripeData } =
          await paymentApi.createStripeSession(stripePayload);
        if (stripeData && stripeData.stripeSessionUrl) {
          window.location.assign(stripeData.stripeSessionUrl);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Thanh toán thất bại',
        description: error,
        variant: 'destructive',
        duration: MILLISECOND_PER_SECOND
      });
    }
  }

  return isLoading && !event ? (
    <Loading />
  ) : (
    <div>
      <div className="flex items-center mt-8">
        <div
          className="text-2xl text-neutral-500 px-8 w-[132px] cursor-pointer"
          onClick={() => router.back()}
        >
          <LuArrowLeft />
        </div>
        <h4 className="flex items-center gap-4">
          <span className="font-bold text-neutral-550">Mua vé</span>
          <span className="text-xs leading-5 px-[6px] h-7 text-neutral-700 bg-neutral-200 rounded-full flex items-center justify-center">
            Thời gian còn lại:{' '}
            {event?.ticketCloseTime &&
              formatDistance(new Date(), new Date(event?.ticketCloseTime), {
                locale: vi
              })}
          </span>
        </h4>
      </div>

      <div className="px-[132px] flex gap-[84px] items-start">
        {/* LEFT */}
        <div className="w-2/3">
          <h2 className="text-[32px] font-bold leading-[48px] mb-10 mt-8">
            {event?.name}
          </h2>
          <div className="flex items-center w-full gap-[18px]">
            <div className="w-1/2">
              <DetailItem
                icon={<LuCalendar />}
                title="Thời gian"
                description={
                  <div className="flex flex-col">
                    <span>
                      {event?.startTime &&
                        formatDateToLocaleDate(new Date(event?.startTime))}
                    </span>
                    <span>
                      {event?.startTime &&
                        formatDateToTime(new Date(event?.startTime))}
                    </span>
                  </div>
                }
              />
            </div>
            <div className="w-1/2">
              <DetailItem
                icon={<LuMapPin />}
                title="Địa điểm"
                description={event?.location}
              />
            </div>
          </div>
          <Separator className="mt-9 mb-8" />
          {/* CONTACT INFORMATION FORM */}
          <div>
            <div>
              <h3 className="text-2xl font-bold leading-9 mb-6">
                Thông tin liên lạc
              </h3>
            </div>
            <Form {...contactForm}>
              <form className="grid grid-cols-2 grid-rows-2 gap-6">
                <div className="col-span-2">
                  <FormField
                    control={contactForm.control}
                    name="fullname"
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
                </div>
                <FormField
                  control={contactForm.control}
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
                  control={contactForm.control}
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
              </form>
            </Form>
          </div>
          {/* TICKET INFORMATION FORM */}
          <div className="mt-[52px]">
            <div>
              <h3 className="text-2xl font-bold leading-9 mb-6">
                Thông tin vé
              </h3>
            </div>
            <Form {...ticketForm}>
              <form>
                <div className="mb-6 px-7 py-10 shadow-m rounded-m border border-solid border-primary-500 flex items-center justify-between">
                  <div>
                    {event && event?.ticketPrice > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>
                          <span className="font-bold">
                            {event?.ticketPrice.toLocaleString()} VNĐ
                          </span>{' '}
                          / Vé
                        </span>
                      </div>
                    ) : (
                      <span className="p-[6px] px-3 inline-flex items-center text-white bg-secondary-500 rounded-full font-bold">
                        Miễn phí
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-[18px]">
                    <Button
                      disabled={quantity <= 0}
                      onClick={e => {
                        e.preventDefault();
                        handleDecreaseQuantity();
                      }}
                      className="w-9 h-9 p-0 text-neutral-600 bg-neutral-300 hover:bg-neutral-400 rounded-full flex items-center justify-center cursor-pointer font-bold"
                    >
                      <LuMinus />
                    </Button>
                    <span className="inline-block text-xl font-bold leading-[30px]">
                      {quantity}
                    </span>
                    <Button
                      disabled={quantity >= (event?.ticketQuantity || 0)}
                      onClick={e => {
                        e.preventDefault();
                        handleIncreaseQuantity();
                      }}
                      className="w-9 h-9 p-0 text-white bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer font-bold"
                    >
                      <LuPlus />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-[22px]">
                  {ticketForm.watch().tickets.map((ticket, index) => (
                    <TicketForm
                      ticketsForm={ticketForm}
                      contactForm={contactForm}
                      key={index}
                      index={index}
                    />
                  ))}
                  <Button
                    disabled={quantity >= (event?.ticketQuantity || 0)}
                    onClick={e => {
                      e.preventDefault();
                      handleIncreaseQuantity();
                    }}
                    className="w-full flex justify-center items-center gap-2 bg-primary-100 text-primary-500 hover:bg-primary-200"
                  >
                    <LuPlus /> <span>Thêm vé</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-1/3">
          <div className="px-6 pt-11 pb-8 bg-neutral-100 rounded-m">
            <h3 className="text-2xl font-bold mb-4">Thông tin thanh toán</h3>
            <div className="flex items-center justify-between">
              <span className="font-bold">{quantity} x</span>
              <span>
                <span className="font-bold">
                  {event?.ticketPrice.toLocaleString()} VNĐ
                </span>{' '}
                / Vé
              </span>
            </div>
            <Separator className="mt-6 mb-[30px]" />
            <div>
              <div className="flex items-center justify-between ">
                <span>Tổng tiền vé</span>
                <span className="font-bold">
                  {((event?.ticketPrice || 0) * quantity).toLocaleString()} VNĐ
                </span>
              </div>
              {event?.promotionPlan && event?.promotionPlan > 0 ? (
                <div className="flex items-center justify-between mt-[10px]">
                  <span>Giảm giá</span>
                  <span className="font-bold">
                    {`- 
                    ${Math.round(
                      (event?.ticketPrice || 0) *
                        quantity *
                        ((event?.promotionPlan || 0) / 100)
                    ).toLocaleString()}`}{' '}
                    VNĐ
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
            <Separator className="mt-[21px] mb-6" />
            <div className="flex items-center justify-between">
              <span className="font-bold">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-primary-500">
                {Math.round(
                  (event?.ticketPrice || 0) *
                    quantity *
                    (1 - (event?.promotionPlan || 0) / 100)
                ).toLocaleString()}{' '}
                VNĐ
              </span>
            </div>
            {/* <Separator className="mt-[26px] mb-4" />
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold">Phương thức thanh toán</span>
                <span className="text-primary-500 text-sm cursor-pointer">
                  Thay đổi
                </span>
              </div>
            </div> */}
            <Button
              type="button"
              className="text-white mt-7 w-full"
              onClick={handleCheckout}
            >
              Thanh toán ngay
            </Button>
          </div>
        </div>
      </div>

      <div className="px-[132px] py-12 mt-[88px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold leading-[48px]">
            Sự kiện <span className="text-primary-500">tương tự</span>
          </h2>
          <Button
            type="button"
            className="bg-primary-100 text-primary-500 hover:bg-primary-200"
          >
            Xem thêm
          </Button>
        </div>

        {/* <div className="grid grid-cols-2 gap-6">
          {eventLoading ? (
            <>
              <Skeleton className="h-[349px]" />
              <Skeleton className="h-[349px]" />
            </>
          ) : (
            events &&
            events.length > 0 &&
            events
              ?.slice(0, 2)
              .map(event => (
                <EventCard key={event.id} event={event} size="large" />
              ))
          )}
        </div> */}
      </div>
    </div>
  );
};

EventDetailPage.Layout = CustomerLayout;

export default EventDetailPage;
