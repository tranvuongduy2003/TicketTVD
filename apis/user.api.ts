import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { ChangePasswordPayload, Status, User } from '@/models';

export const userApi = {
  getUsers: () => {
    return httpRequest.get<User[]>(API_ROUTE.user, {
      baseURL: process.env.AUTH_API_URL
    });
  },
  getUserById: (id: string) => {
    return httpRequest.get<User>(`${API_ROUTE.user}/${id}`, {
      baseURL: process.env.AUTH_API_URL
    });
  },
  updateUser: (id: string, data: Partial<User>) => {
    return httpRequest.put(`${API_ROUTE.user}/${id}`, data, {
      baseURL: process.env.AUTH_API_URL
    });
  },
  changeUserPassword: (id: string, data: ChangePasswordPayload) => {
    return httpRequest.patch(`${API_ROUTE.user}/${id}/password`, data, {
      baseURL: process.env.AUTH_API_URL
    });
  },
  deactivateUser: (id: string) => {
    return httpRequest.patch(
      `${API_ROUTE.user}/${id}/status`,
      { status: Status.DEACTIVE },
      {
        baseURL: process.env.AUTH_API_URL
      }
    );
  },
  activateUser: (id: string) => {
    return httpRequest.patch(
      `${API_ROUTE.user}/${id}/status`,
      { status: Status.ACTIVE },
      {
        baseURL: process.env.AUTH_API_URL
      }
    );
  }
};
