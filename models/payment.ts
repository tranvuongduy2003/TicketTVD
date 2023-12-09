import { User } from '.';

export type Payment = {
  id: number;
  eventId: number;
  userId: string;
  user?: User;
  quantity: number;
  totalPrice: number;
  discount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: PaymentStatus;
  paymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MyTicket = {
  id: number;
  eventId: number;
  userId: string;
  quantity: number;
  totalPrice: number;
  discount: number;
  coverImage: string;
  name: string;
  location: string;
  eventDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  READYFORPICKUP = 'READYFORPICKUP',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}
