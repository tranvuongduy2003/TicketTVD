export enum TicketStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED'
}

export interface Ticket {
  id: string;
  ticketCode: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  eventId: string;
  price: number;
  isPaid: boolean;
  status: TicketStatus;
  startTime: Date;
  closeTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
