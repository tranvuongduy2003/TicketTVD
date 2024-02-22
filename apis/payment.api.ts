import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { FilteringOptions, MyTicket, Payment } from '@/models';
import {
  CheckoutPayload,
  CreateStripeSessionPayload,
  StripeSession,
  ValidateStripeSessionResponse
} from '@/types';

export const paymentApi = {
  getAllPayments: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Payment[]>(API_ROUTE.payment, {
      params: options
    });
  },
  getPaymentsByUserId: (
    userId: string,
    options?: Partial<FilteringOptions>
  ) => {
    return httpRequest.get<Payment[]>(`${API_ROUTE.payment}/${userId}`, {
      params: options
    });
  },
  getPaymentsByEventId: (
    eventId: string,
    options?: Partial<FilteringOptions>
  ) => {
    return httpRequest.get<Payment[]>(`${API_ROUTE.payment}/event/${eventId}`, {
      params: options
    });
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
  validateStripeSession: (paymentId: string) => {
    return httpRequest.post<ValidateStripeSessionResponse>(
      API_ROUTE.payment + `/${paymentId}/validate-stripe-session`,
      {}
    );
  }
};
