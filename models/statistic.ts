import { Category } from '.';

export interface EventStatistic {
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  eventQuantity: number;
  category: Category;
}

export interface Revenue {
  month: number;
  value: number;
}

export interface GeneralStatistic {
  totalEvents: number;
  totalBoughtTickets: number;
  totalUsers: number;
  totalCategories: number;
}

export interface PaymentsStatistic {
  totalPayments: number;
  totalBoughtTickets: number;
  totalRevenue: number;
}
