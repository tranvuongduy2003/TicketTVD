import { eventApi, paymentApi, ticketApi } from '@/apis';
import { DetailItem } from '@/components/event';
import { OrganizerLayout } from '@/components/layout';
import { TerminateTicketDialog } from '@/components/payment';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast
} from '@/components/ui';
import { MILLISECOND_PER_SECOND, PHONE_REGEX } from '@/constants';
import { Event, NextPageWithLayout, TicketStatus } from '@/models';
import { PaymentTicket, ValidateStripeSessionResponse } from '@/types';
import {
  calculateTime,
  formatDateToLocaleDate,
  formatDateToTime
} from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LuArrowLeft,
  LuCalendar,
  LuClock,
  LuCopy,
  LuMapPin,
  LuPenSquare,
  LuTicket
} from 'react-icons/lu';
import QRCode from 'react-qr-code';
import * as z from 'zod';

interface TicketItemProps {
  tickets: PaymentTicket[];
  setTickets: Function;
  index: number;
  ticket: PaymentTicket;
}

const ticketFormSchema = z.object({
  id: z.string().optional(),
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

const MyEventTicketDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { paymentId } = router.query;

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [bill, setBill] = useState<ValidateStripeSessionResponse>();
  const [event, setEvent] = useState<Event>();

  const handleValidateStripeSession = useRef<any>(null);

  useEffect(() => {
    handleValidateStripeSession.current = async () => {
      setIsValidating(true);
      try {
        if (paymentId) {
          const { data: stripeData } = await paymentApi.validateStripeSession(
            paymentId as string
          );
          const { data: event } = await eventApi.getEventById(
            stripeData!.eventId
          );
          setEvent(event);
          setBill(stripeData);
        }
        setIsValidating(false);
      } catch (error) {
        setIsValidating(false);
        console.log(error);
      }
    };
    handleValidateStripeSession.current();
    () => handleValidateStripeSession.current;
  }, [paymentId]);

  return isValidating || !bill || !event ? (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center">
        <Loading size="large" />
        <p className="text-2xl text-neutral-600 font-bold">
          Đang tải dữ liệu vé ...
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="px-32">
        {event && (
          <div className="mt-[39px]">
            <span
              className="flex item-center gap-2 text-neutral-550 leading-none mb-5 hover:text-neutral-700 cursor-pointer"
              onClick={() => router.back()}
            >
              <LuArrowLeft /> Quay lại
            </span>
            <h2 className="text-[32px] font-bold mb-9">{event.name}</h2>
            <div className="grid grid-cols-4">
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
              <DetailItem
                icon={<LuClock />}
                title="Diễn ra trong"
                description={
                  event?.ticketStartTime &&
                  event?.ticketCloseTime &&
                  calculateTime(event?.ticketStartTime, event?.ticketCloseTime)
                }
              />
              <DetailItem
                icon={<LuMapPin />}
                title="Địa điểm"
                description={event.location}
              />
              <DetailItem
                icon={<LuTicket />}
                title={`${bill?.tickets.length} Vé`}
                description="Email eTicket"
              />
            </div>
          </div>
        )}

        <Separator className="my-[46px]" />
        <div>
          <h3 className="text-2xl font-bold mb-[22px]">Thông tin thanh toán</h3>
          <div className="flex items-center gap-x-24">
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Mã thanh toán</div>
              <div>#{bill?.id}</div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Thời gian</div>
              <div>
                {new Date(bill?.createdAt as Date).toLocaleDateString('vi-VN', {
                  dateStyle: 'long'
                })}
              </div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Tổng tiền</div>
              <div>
                {(bill?.totalPrice as number)?.toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
            {bill?.paymentMethod && (
              <div className="flex flex-col gap-[5px] items-start">
                <div className="text-neutral-550">Phương thức thanh toán</div>
                <div className="capitalize">
                  {bill?.paymentMethod.card} - **** {bill?.paymentMethod.last4}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-[58px]">
          <h3 className="text-2xl font-bold mb-[22px]">Thông tin liên lạc</h3>
          <div className="flex items-center gap-x-24">
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Họ tên</div>
              <div>{bill?.customerName}</div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Email</div>
              <div>{bill?.customerEmail}</div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Số điện thoại</div>
              <div>{bill?.customerPhone}</div>
            </div>
          </div>
        </div>
        <div className="my-[58px]">
          <h3 className="text-2xl font-bold mb-[22px]">
            Thông tin vé ({bill?.tickets.length}){' '}
            <span className="text-primary-500">
              tổng:{' '}
              {(
                ((bill?.totalPrice || 0) / (100 - (bill?.discount || 0))) *
                100
              ).toLocaleString('vi-VN')}{' '}
              VNĐ
            </span>
          </h3>
          <div className="flex flex-col gap-5">
            {bill &&
              bill.tickets &&
              bill.tickets.length > 0 &&
              bill.tickets.map((ticket, index) => (
                <TicketItem
                  key={index}
                  index={index}
                  ticket={ticket}
                  tickets={bill.tickets}
                  setTickets={(tickets: PaymentTicket[]) =>
                    setBill(prevBill => {
                      const curBill = {
                        ...prevBill
                      } as ValidateStripeSessionResponse;
                      curBill.tickets = tickets;

                      return curBill;
                    })
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function TicketItem({ index, ticket, tickets, setTickets }: TicketItemProps) {
  const [isEditted, setIsEditted] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const editTicketForm = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      id: ticket.id,
      fullname: ticket.ownerName,
      email: ticket.ownerEmail,
      phone: ticket.ownerPhone
    },
    mode: 'onChange'
  });

  async function handleCopyTicketCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Đã copy mã vé',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.25
      });
    } catch (err: any) {
      toast({
        title: 'Copy mã vé thất bại',
        description: err,
        duration: MILLISECOND_PER_SECOND * 0.25
      });
    }
  }

  async function handleUpdateTicketInfo() {
    try {
      await ticketApi.updateTicketInfo(ticket.id!, {
        fullname: editTicketForm.watch().fullname,
        email: editTicketForm.watch().email,
        phone: editTicketForm.watch().phone
      });

      // TODO: Set new tickets
      const ticketsList = JSON.parse(JSON.stringify(tickets));

      ticketsList[index].ownerName = editTicketForm.watch().fullname;
      ticketsList[index].ownerEmail = editTicketForm.watch().email;
      ticketsList[index].ownerPhone = editTicketForm.watch().phone;

      setTickets(ticketsList);

      setIsEditted(false);

      toast({
        title: 'Chỉnh sửa thông tin vé thành công',
        description: '',
        duration: MILLISECOND_PER_SECOND * 0.25
      });
    } catch (error: any) {
      toast({
        title: 'Chỉnh sửa thông tin vé thất bại',
        description: error,
        duration: MILLISECOND_PER_SECOND * 0.25
      });
    }
  }

  return (
    <div className="py-5 px-[30px] rounded-m bg-neutral-100 border-neutral-200 relative">
      {ticket.status === TicketStatus.TERMINATED && (
        <div className="flex items-center justify-center w-full h-full rounded-m absolute z-0 top-0 left-0 overflow-hidden">
          <div className="w-full h-full bg-neutral-500 opacity-25 z-10 absolute"></div>
          <div className=" z-20 p-8 text-4xl rounded-md text-danger-500 border-2 border-solid border-danger-500 inline-block font-extrabold">
            Vé không hợp lệ
          </div>
        </div>
      )}
      <h4 className="flex items-center gap-4 font-bold">
        <LuTicket className="text-2xl text-primary-500" />
        <span>Vé {index + 1}</span>
        {ticket.status !== TicketStatus.TERMINATED && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="font-bold text-primary-500"
                onClick={() => setIsEditted(true)}
              >
                <LuPenSquare />
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa thông tin vé</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </h4>
      {isEditted ? (
        <div className="px-6">
          <Form {...editTicketForm}>
            <form
              className="grid grid-cols-2 grid-rows-2 gap-6 py-[30px]"
              onSubmit={editTicketForm.handleSubmit(handleUpdateTicketInfo)}
            >
              <div className="col-span-2">
                <FormField
                  control={editTicketForm.control}
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
                control={editTicketForm.control}
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
                control={editTicketForm.control}
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
              <div className="flex justify-end gap-2 col-span-2 ">
                <Button
                  className="text-neutral-700 bg-neutral-300 hover:bg-neutral-400"
                  onClick={() => setIsEditted(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="text-white">
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex flex-1 items-center justify-between mr-14 ml-7">
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Họ tên</div>
              <div>{ticket.ownerName}</div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Email</div>
              <div>{ticket.ownerEmail}</div>
            </div>
            <div className="flex flex-col gap-[5px] items-start">
              <div className="text-neutral-550">Số điện thoại</div>
              <div>{ticket.ownerPhone}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl flex items-center p-5 gap-5">
            <div className="flex-1 flex flex-col items-center text-primary-500 ">
              <span>Mã vé</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="font-bold truncate w-[105px]">
                    {ticket.ticketCode}
                  </TooltipTrigger>
                  <TooltipContent>{ticket.ticketCode}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="font-bold text-center">
                    <div
                      onClick={() => handleCopyTicketCode(ticket.ticketCode!)}
                    >
                      <LuCopy />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Sao chép mã vé</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-[105px] h-[105px]">
              <QRCode
                value={ticket.ticketCode || ''}
                className="w-full h-full"
              />
            </div>
          </div>
          {ticket.status !== TicketStatus.TERMINATED && (
            <Button
              variant={'destructive'}
              size={'sm'}
              className="ml-4"
              onClick={() => setIsDialogOpen(true)}
            >
              Hủy vé
            </Button>
          )}
        </div>
      )}
      {isDialogOpen && (
        <TerminateTicketDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          ticketId={ticket.id!}
        />
      )}
    </div>
  );
}

MyEventTicketDetailsPage.Layout = OrganizerLayout;

export default MyEventTicketDetailsPage;
