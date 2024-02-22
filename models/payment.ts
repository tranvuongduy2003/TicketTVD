import { User } from '.';

export interface Payment {
  id: string;
  eventId: string;
  userId: string;
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
  event?: Event;
  user?: User;
}

export interface PaymentIndex extends Payment {
  key: any;
}

export interface MyTicket {
  id: string;
  eventId: string;
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
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  READYFORPICKUP = 'READYFORPICKUP',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}
