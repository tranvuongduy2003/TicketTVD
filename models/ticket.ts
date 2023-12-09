export type Ticket = {
  id: number;
  ticketCode: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  eventId: number;
  price: number;
  isPaid: boolean;
  startTime: Date;
  closeTime: Date;
  createdAt: Date;
  updatedAt: Date;
};
