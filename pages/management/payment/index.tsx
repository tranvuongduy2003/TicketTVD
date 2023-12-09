import { AdminLayout } from '@/components/layout';
import { columns } from '@/components/payment';
import { DataTable } from '@/components/payment/data-table';
import { usePayments, useUsers } from '@/hooks';
import { NextPageWithLayout } from '@/models';

const Payment: NextPageWithLayout = () => {
  const { payments } = usePayments();
  const { users } = useUsers();

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý đơn mua
      </h1>

      <div>
        <DataTable
          data={
            payments?.map(item => {
              const user = users?.find(u => u.id == item.userId);

              return { ...item, user: user };
            }) || []
          }
          columns={columns}
        />
      </div>
    </div>
  );
};

Payment.Layout = AdminLayout;

export default Payment;
