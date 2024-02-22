import { AdminLayout } from '@/components/layout';
import { columns } from '@/components/payment';
import { DataTable } from '@/components/ui/data-table';
import { Loading } from '@/components/ui';
import { usePayments } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

const Payment: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { payments, meta, isLoading } = usePayments({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    takeAll: false
  });

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý đơn mua
      </h1>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={payments || []}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            meta={meta}
          />
        )}
      </div>
    </div>
  );
};

Payment.Layout = AdminLayout;

export default Payment;
