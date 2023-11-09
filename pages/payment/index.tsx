import { AdminLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/models';

export interface PaymentProps {}

const Payment: NextPageWithLayout = (props: PaymentProps) => {
  return <div>Payment</div>;
};

Payment.Layout = AdminLayout;

export default Payment;
