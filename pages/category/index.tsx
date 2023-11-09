import { AdminLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

export interface CategoryProps {}

const Category: NextPageWithLayout = (props: CategoryProps) => {
  return <div>Category</div>;
};

Category.Layout = AdminLayout;

export default Category;
