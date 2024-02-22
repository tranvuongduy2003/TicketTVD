export interface Category {
  id: string;
  name: string;
  color: string;
  totalEvents?: number;
  totalTickets?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryPayload {
  name: string;
  color: string;
}
