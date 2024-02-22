import { AdminLayout } from '@/components/layout';
import {
  Loading,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { customerColumns, organizerColumns } from '@/components/user';
import { useCustomers, useOrganizers } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

const UserPage: NextPageWithLayout = () => {
  const [customerPagination, setCustomerPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 5
    }
  );
  const [organizerPagination, setOrganizerPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5
    });

  const {
    users: customers,
    meta: customersMeta,
    isLoading: customersLoading
  } = useCustomers({
    page: customerPagination.pageIndex + 1,
    size: customerPagination.pageSize,
    takeAll: false
  });
  const {
    users: organizers,
    meta: organizersMeta,
    isLoading: organizersLoading
  } = useOrganizers({
    page: organizerPagination.pageIndex + 1,
    size: organizerPagination.pageSize,
    takeAll: false
  });

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
              Khách hàng
            </TabsTrigger>
            <TabsTrigger
              value="organizer"
              className="border-b-[3px] border-solid border-transparent px-3 py-[15px] data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 rounded-none"
            >
              Chủ sự kiện
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            {customersLoading ? (
              <Loading />
            ) : (
              <DataTable
                data={customers ?? []}
                columns={customerColumns}
                pagination={customerPagination}
                setPagination={setCustomerPagination}
                meta={customersMeta}
              />
            )}
          </TabsContent>
          <TabsContent value="organizer">
            {organizersLoading ? (
              <Loading />
            ) : (
              <DataTable
                data={organizers ?? []}
                columns={organizerColumns}
                pagination={organizerPagination}
                setPagination={setOrganizerPagination}
                meta={organizersMeta}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

UserPage.Layout = AdminLayout;

export default UserPage;
