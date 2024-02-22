import { CustomerLayout } from '@/components/layout';
import { MyTicketCard } from '@/components/my-tickets';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Input,
  Skeleton
} from '@/components/ui';
import { useMyTickets } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { useProfileStore } from '@/stores';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LuPen } from 'react-icons/lu';

const PER_PAGE = 3;

const MyTicketsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [page, setPage] = useState<number>(1);

  const { profile } = useProfileStore();
  const { myTickets, isLoading: myTicketsLoading } = useMyTickets(
    profile?.id || ''
  );

  return (
    <div>
      <div className="px-[132px]">
        <h2 className="text-[32px] font-bold my-8">Vé của tôi</h2>
        <div className="flex gap-8">
          {/* LEFT */}
          <div className="w-1/3">
            <div className="w-full bg-neutral-100 rounded-m px-6 py-8 flex flex-col items-center">
              <Avatar className="w-[140px] h-[140px]">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    suppressHydrationWarning
                    src={profile?.avatar}
                    alt="avatar"
                    style={{ objectFit: 'cover' }}
                  />
                  <AvatarFallback>UIT</AvatarFallback>
                </Avatar>
              </Avatar>
              <h3
                className="text-2xl font-bold text-primary-500 mt-4 mb-[5px]"
                suppressHydrationWarning
              >
                {profile?.name}
              </h3>
              <p className="text-sm" suppressHydrationWarning>
                {profile?.email}
              </p>
              <div className="flex justify-center mt-6 mb-[30px] w-full gap-2">
                <Badge className="text-primary-500 font-normal bg-primary-100 px-2 rounded-m h-7 hover:bg-primary-150">
                  24 đơn mua
                </Badge>
                <Badge className="text-primary-500 font-normal bg-primary-100 px-2 rounded-m h-7 hover:bg-primary-150">
                  4 đang theo dõi
                </Badge>
                <Badge className="text-primary-500 font-normal bg-primary-100 px-2 rounded-m h-7 hover:bg-primary-150">
                  24 yêu thích
                </Badge>
              </div>
              <Button
                type="button"
                className="flex items-center gap-[6px] text-white w-full"
                onClick={() => router.push('/profile')}
              >
                <LuPen /> <span>Chỉnh sửa thông tin</span>
              </Button>
            </div>
          </div>
          <div className="w-2/3">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                <b>{myTickets?.length}</b> sự kiện
              </span>
              <div className="w-1/2">
                <Input placeholder="Tìm kiếm" />
              </div>
            </div>

            <div className="mt-[21px] flex flex-col gap-8">
              {myTicketsLoading ? (
                <>
                  <Skeleton className="h-[221px]" />
                  <Skeleton className="h-[221px]" />
                  <Skeleton className="h-[221px]" />
                </>
              ) : (
                myTickets &&
                myTickets.length > 0 &&
                myTickets
                  .slice(0, page * PER_PAGE)
                  .map(myTicket => (
                    <MyTicketCard key={myTicket.id} myTicket={myTicket} />
                  ))
              )}
            </div>
            <div className="mt-8 flex justify-center">
              {myTickets &&
                (page * PER_PAGE < myTickets.length ? (
                  <Button
                    type="button"
                    className="text-white"
                    onClick={() => setPage(curPage => curPage + 1)}
                  >
                    Xem thêm
                  </Button>
                ) : (
                  myTickets.length < PER_PAGE && (
                    <Button
                      type="button"
                      className="text-white"
                      onClick={() => setPage(1)}
                    >
                      Thu gọn
                    </Button>
                  )
                ))}
            </div>
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

MyTicketsPage.Layout = CustomerLayout;

export default MyTicketsPage;
