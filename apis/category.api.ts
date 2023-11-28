import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Category } from '@/models';

export const categoryApi = {
  getCategories: () => {
    return httpRequest.get<Category[]>(API_ROUTE.category, {
      baseURL: process.env.CATEGORY_API_URL
    });
  },
  getCategoryById: (id: number) => {
    return httpRequest.get<Category>(`${API_ROUTE.category}/${id}`, {
      baseURL: process.env.CATEGORY_API_URL
    });
  },
  updateCategory: (id: number, data: Partial<Category>) => {
    return httpRequest.put<any, Partial<Category>>(
      `${API_ROUTE.category}/${id}`,
      data,
      {
        baseURL: process.env.CATEGORY_API_URL
      }
    );
  },
  deleteCategory: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.category}/${id}`, {
      baseURL: process.env.CATEGORY_API_URL
    });
  }
};
