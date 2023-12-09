import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Ticket } from '@/models';

export const ticketApi = {
  getAllTickets: () => {
    return httpRequest.get<Ticket[]>(API_ROUTE.ticket, {
      baseURL: process.env.TICKET_API_URL
    });
  }
};
