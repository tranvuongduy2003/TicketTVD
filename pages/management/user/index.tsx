import { AdminLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { customerColumns, organizerColumns } from '@/components/user';
import { DataTable } from '@/components/user/data-table';
import { useEvents, usePayments, useUsers } from '@/hooks';
import { NextPageWithLayout, Role, User } from '@/models';

const UserPage: NextPageWithLayout = () => {
  const { users } = useUsers();
  const { payments } = usePayments();
  const { events } = useEvents();

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý người dùng
      </h1>

      <div>
        <Tabs defaultValue="customer">
          <TabsList className="bg-transparent shadow-none h-auto mb-7">
            <TabsTrigger
              value="customer"
              className="border-b-[3px] border-solid border-transparent px-3 py-[15px] data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 rounded-none"
            >
              Khán giả
            </TabsTrigger>
            <TabsTrigger
              value="organizer"
              className="border-b-[3px] border-solid border-transparent px-3 py-[15px] data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 rounded-none"
            >
              Chủ sự kiện
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <DataTable
              data={
                users
                  ?.filter((user: User) => user.role === Role.CUSTOMER)
                  .map(user => {
                    const totalTickets = payments
                      ?.filter(payment => payment.userId === user.id)
                      ?.reduce(
                        (curQuantity, curPayment) =>
                          curQuantity + curPayment.quantity,
                        0
                      );

                    return { ...user, totalBuyedTickets: totalTickets } as User;
                  }) ?? []
              }
              columns={customerColumns}
            />
          </TabsContent>
          <TabsContent value="organizer">
            <DataTable
              data={
                users
                  ?.filter((user: User) => user.role === Role.ORGANIZER)
                  .map(user => {
                    const totalEvents = events?.filter(
                      event => event.creatorId === user.id
                    );

                    const totalTickets = payments
                      ?.filter(
                        payment =>
                          totalEvents?.some(
                            event => event.id === payment.eventId
                          )
                      )
                      .reduce(
                        (curQuantity, curPayment) =>
                          curQuantity + curPayment.quantity,
                        0
                      );

                    return {
                      ...user,
                      totalEvents: totalEvents?.length,
                      totalSoldTickets: totalTickets
                    } as User;
                  }) ?? []
              }
              columns={organizerColumns}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

UserPage.Layout = AdminLayout;

export default UserPage;
