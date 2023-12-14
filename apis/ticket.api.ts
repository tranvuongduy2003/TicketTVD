import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Ticket, TicketDetail } from '@/models';
import { UpdateTicketPayload } from '@/types';

export const ticketApi = {
  getAllTickets: () => {
    return httpRequest.get<Ticket[]>(API_ROUTE.ticket);
  },
  getAllTicketDetails: () => {
    return httpRequest.get<TicketDetail[]>(API_ROUTE.ticketDetail);
  },
  updateTicketInfo: (id: number, ticket: UpdateTicketPayload) => {
    return httpRequest.patch<Ticket, UpdateTicketPayload>(
      `${API_ROUTE.ticket}/${id}`,
      ticket
    );
  },
  terminateTicket: (id: number) => {
    return httpRequest.patch<Ticket>(`${API_ROUTE.ticket}/terminate/${id}`, {});
  }
};
