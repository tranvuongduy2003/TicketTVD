import { Category, FilteringOptions, User } from '.';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  OPENING = 'OPENING',
  CLOSED = 'CLOSED'
}

export interface Event {
  id: string;
  coverImage: string;
  name: string;
  description: string;
  categoryId: string;
  album: string[];
  location: string;
  startTime: Date;
  endTime: Date;
  ticketSoldQuantity: number;
  ticketQuantity: number;
  ticketPrice: number;
  ticketStartTime: Date;
  ticketCloseTime: Date;
  isPromotion: boolean;
  promotionPlan: number;
  creatorId: string;
  favourite: number;
  share: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  creator?: User;
}

export interface CreateEventPayload {
  coverImage: string;
  name: string;
  description: string;
  categoryId: string;
  album: string[];
  location: string;
  startTime: Date;
  endTime: Date;
  ticketQuantity: number;
  ticketPrice: number;
  ticketStartTime: Date;
  ticketCloseTime: Date;
  isPromotion: boolean;
  promotionPlan: number;
  creatorId: string;
}

export interface EventsStatistic {
  totalEvents: number;
  totalBoughtTickets: number;
  revenue: number;
}

export enum HighlightType {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  NONE = 'NONE'
}

export interface HighlightEvent {
  event: Event;
  highlightType: HighlightType;
}

export enum PriceType {
  FREE = 'FREE',
  PAID = 'PAID'
}

export interface EventFilter extends FilteringOptions {
  categoryKeys: string[];
  price: PriceType[];
  time: EventStatus[];
}
