import { columns } from '@/components/categories';
import { DataTable } from '@/components/categories/data-table';
import { AdminLayout } from '@/components/layout';
import { useCategories, useEvents, usePayments } from '@/hooks';
import { Category, NextPageWithLayout } from '@/models';

const CategoryManagementPage: NextPageWithLayout = () => {
  const { categories } = useCategories();
  const { payments } = usePayments();
  const { events } = useEvents();

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý sự kiện
      </h1>

      <div>
        <DataTable
          data={
            categories?.map(category => {
              const totalEvents = events?.filter(
                event => event.categoryId === category.id
              );

              const totalTickets = payments
                ?.filter(
                  payment =>
                    totalEvents?.some(event => event.id === payment.eventId)
                )
                .reduce(
                  (curQuantity, curPayment) =>
                    curQuantity + curPayment.quantity,
                  0
                );

              return {
                ...category,
                totalEvents: totalEvents?.length,
                totalTickets: totalTickets
              } as Category;
            }) ?? []
          }
          columns={columns}
        />
      </div>
    </div>
  );
};

CategoryManagementPage.Layout = AdminLayout;

export default CategoryManagementPage;
