export enum TicketStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED'
}

export type Ticket = {
  id: number;
  ticketCode: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  eventId: number;
  price: number;
  isPaid: boolean;
  status: TicketStatus;
  startTime: Date;
  closeTime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TicketDetail = {
  id: number;
  eventId: number;
  quantity: number;
  soldQuantity: number;
  price: number;
  startTime: Date;
  closeTime: Date;
};
