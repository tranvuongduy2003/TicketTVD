import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import {
  Category,
  CreateCategoryPayload,
  FilteringOptions,
  PageOrder
} from '@/models';

export const categoryApi = {
  getCategories: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Category[]>(API_ROUTE.category, {
      params: options
    });
  },
  getStatisticCategories: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Category[]>(API_ROUTE.category + '/statistic', {
      params: options
    });
  },
  getCategoryById: (id: string) => {
    return httpRequest.get<Category>(`${API_ROUTE.category}/${id}`);
  },
  createCategory: (data: CreateCategoryPayload) => {
    return httpRequest.post<any, CreateCategoryPayload>(
      API_ROUTE.category,
      data
    );
  },
  updateCategory: (id: string, data: CreateCategoryPayload) => {
    return httpRequest.put<any, CreateCategoryPayload>(
      `${API_ROUTE.category}/${id}`,
      data
    );
  },
  deleteCategory: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.category}/${id}`);
  }
};
