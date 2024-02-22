import { columns } from '@/components/categories';
import { AdminLayout } from '@/components/layout';
import { Loading } from '@/components/ui';
import { DataTable } from '@/components/ui/data-table';
import { useStatisticCategories } from '@/hooks';
import { NextPageWithLayout } from '@/models';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

const CategoryManagementPage: NextPageWithLayout = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { categories, meta, isLoading } = useStatisticCategories({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    takeAll: true
  });

  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý thể loại
      </h1>

      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            data={categories ?? []}
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

CategoryManagementPage.Layout = AdminLayout;

export default CategoryManagementPage;
