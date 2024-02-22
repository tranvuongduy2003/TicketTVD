import { Button } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { LuHome } from 'react-icons/lu';

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex items-center gap-[88px]">
      <div className="relative w-1/2 h-[400px]">
        <Image
          src={'/images/404.png'}
          alt="404 images"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="w-1/2">
        <h3 className="text-primary-500 font-bold text-2xl">Ôi không..</h3>
        <h2 className="text-[44px] font-bold mb-1">Đã xảy ra lỗi</h2>
        <p className="text-neutral-600 mb-6">
          Có vẻ như trang này không tồn tại hoặc đã bị xóa.
        </p>
        <Link href={'/'}>
          <Button className="text-white gap-2">
            <LuHome />
            Trở về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
