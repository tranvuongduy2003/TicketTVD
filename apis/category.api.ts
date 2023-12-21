import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Category } from '@/models';

export const categoryApi = {
  getCategories: () => {
    return httpRequest.get<Category[]>(API_ROUTE.category);
  },
  getCategoryById: (id: number) => {
    return httpRequest.get<Category>(`${API_ROUTE.category}/${id}`);
  },
  createCategory: (data: Partial<Category>) => {
    return httpRequest.post<any, Partial<Category>>(
      `${API_ROUTE.category}`,
      data
    );
  },
  updateCategory: (id: number, data: Partial<Category>) => {
    return httpRequest.put<any, Partial<Category>>(
      `${API_ROUTE.category}/${id}`,
      data
    );
  },
  deleteCategory: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.category}/${id}`);
  }
};
