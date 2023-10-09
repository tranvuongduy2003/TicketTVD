import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

const Home: NextPageWithLayout = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <span className="text-9xl">TRANG CHỦ</span>
    </div>
  );
};

Home.Layout = MainLayout;

export default Home;
