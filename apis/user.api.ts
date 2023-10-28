import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { User } from '@/models';

export const userApi = {
  getUsers: () => {
    return httpRequest.get<User[]>(API_ROUTE.user);
  },
  getUserById: (id: string) => {
    return httpRequest.get<User>(`${API_ROUTE.user}/${id}`);
  }
};
