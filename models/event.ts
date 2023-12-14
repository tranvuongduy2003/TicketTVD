import { Category } from '.';

export enum UserStatus {
  UPCOMING = 'UPCOMING',
  OPENING = 'OPENING',
  CLOSED = 'CLOSED'
}

export type Event = {
  id: number;
  coverImage: string;
  name: string;
  description: string;
  categoryId: number;
  album: string[];
  location: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  ticketTypeId: number;
  ticketIsPaid: boolean;
  ticketSoldQuantity: number;
  ticketQuantity: number;
  ticketPrice: number;
  ticketStartTime: Date;
  ticketCloseTime: Date;
  isPromotion: boolean;
  promotionPlan: number;
  publishTime: Date;
  creatorId: string;
  favourite: number;
  share: number;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
};
