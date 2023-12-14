import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Ticket, TicketDetail } from '@/models';
import { UpdateTicketPayload } from '@/types';

export const ticketApi = {
  getAllTickets: () => {
    return httpRequest.get<Ticket[]>(API_ROUTE.ticket, {
      baseURL: process.env.TICKET_API_URL
    });
  },
  getAllTicketDetails: () => {
    return httpRequest.get<TicketDetail[]>(API_ROUTE.ticketDetail, {
      baseURL: process.env.TICKET_API_URL
    });
  },
  updateTicketInfo: (id: number, ticket: UpdateTicketPayload) => {
    return httpRequest.patch<Ticket, UpdateTicketPayload>(
      `${API_ROUTE.ticket}/${id}`,
      ticket,
      {
        baseURL: process.env.TICKET_API_URL
      }
    );
  },
  terminateTicket: (id: number) => {
    return httpRequest.patch<Ticket>(
      `${API_ROUTE.ticket}/terminate/${id}`,
      {},
      {
        baseURL: process.env.TICKET_API_URL
      }
    );
  }
};
