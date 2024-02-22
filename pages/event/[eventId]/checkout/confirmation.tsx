import { eventApi, paymentApi } from '@/apis';
import { DetailItem } from '@/components/event';
import { CustomerLayout } from '@/components/layout';
import { Button, Loading, Separator } from '@/components/ui';
import { Event, NextPageWithLayout } from '@/models';
import { PaymentTicket, ValidateStripeSessionResponse } from '@/types';
import {
  calculateTime,
  formatDateToLocaleDate,
  formatDateToTime
} from '@/utils';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  LuCalendar,
  LuCheckCircle2,
  LuClock,
  LuMapPin,
  LuTicket
} from 'react-icons/lu';
import QRCode from 'react-qr-code';

interface TicketItemProps {
  index: number;
  ticket: PaymentTicket;
}

const CheckoutConfirmation: NextPageWithLayout = () => {
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
          Đang kiểm tra giao dịch ...
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="px-32">
        <div className="mt-[29px] mb-[39px] p-[34px] rounded-m border-secondary-500 bg-secondary-100 border border-solid flex items-center gap-[22px]">
          <LuCheckCircle2 className="text-[44px] text-secondary-500" />
          <span className="text-xl font-bold text-neutral-700">
            Thanh toán thành công
          </span>
        </div>
        {event && (
          <div>
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
        <div className="mt-[58px]">
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
                <TicketItem key={index} index={index} ticket={ticket} />
              ))}
          </div>
        </div>
        <Button
          type="button"
          className="text-white mt-10"
          onClick={() => router.push('/my-tickets')}
        >
          Đi đến vé của tôi
        </Button>
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

function TicketItem({ index, ticket }: TicketItemProps) {
  return (
    <div className="py-5 px-[30px] rounded-m bg-neutral-100 border-neutral-200">
      <h4 className="flex items-center gap-4 font-bold">
        <LuTicket className="text-2xl text-primary-500" />
        <span>Vé {index + 1}</span>
      </h4>
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
            <span className="font-bold truncate w-[105px]">
              {ticket.ticketCode}
            </span>
          </div>
          <div className="w-[105px] h-[105px]">
            <QRCode value={ticket.ticketCode || ''} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

CheckoutConfirmation.Layout = CustomerLayout;

export default CheckoutConfirmation;
