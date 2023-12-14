import { PaymentStatus, Status, TicketStatus } from '@/models';

export type CheckoutPayload = {
  eventId: number;
  userId: string;
  tickets: PaymentTicket[];
  totalPrice: number;
  discount: number;
  contactInfo: ContactInfo;
  quantity: number;
};

export type PaymentTicket = {
  id?: number;
  ticketCode?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  eventId: number;
  price: number;
  status?: TicketStatus;
  startTime: Date;
  closeTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type ContactInfo = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type CreateStripeSessionPayload = {
  approvedUrl: string;
  cancelUrl: string;
  paymentId: number;
  tickets: PaymentTicket[];
};

export type StripeSession = {
  stripeSessionUrl: string;
  stripeSessionId: string;
  approvedUrl: string;
  cancelUrl: string;
  paymentId: number;
  tickets: PaymentTicket[];
};

export type ValidateStripeSessionResponse = {
  id: number;
  quantity: number;
  eventId: number;
  status: PaymentStatus;
  tickets: PaymentTicket[];
  discount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  userId: string;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
};

type PaymentMethod = {
  card: string;
  last4: string;
};
