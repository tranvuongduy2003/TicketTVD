import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { MyTicket, Payment } from '@/models';
import {
  CheckoutPayload,
  CreateStripeSessionPayload,
  StripeSession,
  ValidateStripeSessionResponse
} from '@/types';

export const paymentApi = {
  getAllPayments: () => {
    return httpRequest.get<Payment[]>(API_ROUTE.payment);
  },
  getPaymentsByEventId: (eventId: number) => {
    return httpRequest.get<Payment[]>(`${API_ROUTE.payment}/event/${eventId}`);
  },
  getPaymentsByUserId: (userId: string) => {
    return httpRequest.get<Payment[]>(`${API_ROUTE.payment}/${userId}`);
  },
  checkout: (data: CheckoutPayload) => {
    return httpRequest.post<Payment, CheckoutPayload>(
      API_ROUTE.payment + '/checkout',
      data
    );
  },
  getMyTickets: (userId: string) => {
    return httpRequest.get<MyTicket[]>(API_ROUTE.payment + '/' + userId);
  },
  createStripeSession: (data: CreateStripeSessionPayload) => {
    return httpRequest.post<StripeSession, CreateStripeSessionPayload>(
      API_ROUTE.payment + '/create-stripe-session',
      data
    );
  },
  validateStripeSession: (paymentId: number) => {
    return httpRequest.post<ValidateStripeSessionResponse>(
      API_ROUTE.payment + `/validate-stripe-session/${paymentId}`,
      {}
    );
  }
};
