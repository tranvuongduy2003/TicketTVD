import { AdminLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { customerColumns, organizerColumns } from '@/components/user';
import { DataTable } from '@/components/user/data-table';
import { useUsers } from '@/hooks';
import { NextPageWithLayout, Role } from '@/models';

const UserPage: NextPageWithLayout = () => {
  const { users } = useUsers();

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
                users?.filter((user: any) => user.role === Role.CUSTOMER) ?? []
              }
              columns={customerColumns}
            />
          </TabsContent>
          <TabsContent value="organizer">
            <DataTable
              data={
                users?.filter((user: any) => user.role === Role.ORGANIZER) ?? []
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
