import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import {
  ChangePasswordPayload,
  Customer,
  FilteringOptions,
  Organizer,
  Status,
  User
} from '@/models';

export const userApi = {
  getUsers: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<User[]>(API_ROUTE.user, {
      params: options
    });
  },
  getUsersInCustomer: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Customer[]>(API_ROUTE.user + '/customer', {
      params: options
    });
  },
  getUsersInOrganizer: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Organizer[]>(API_ROUTE.user + '/organizer', {
      params: options
    });
  },
  getUserById: (id: string) => {
    return httpRequest.get<User>(`${API_ROUTE.user}/${id}`);
  },
  updateUser: (id: string, data: Partial<User>) => {
    return httpRequest.put(`${API_ROUTE.user}/${id}`, data);
  },
  changeUserPassword: (id: string, data: ChangePasswordPayload) => {
    return httpRequest.patch(`${API_ROUTE.user}/${id}/password`, data);
  },
  deactivateUser: (id: string) => {
    return httpRequest.patch(`${API_ROUTE.user}/${id}/status`, {
      status: Status.DEACTIVE
    });
  },
  activateUser: (id: string) => {
    return httpRequest.patch(`${API_ROUTE.user}/${id}/status`, {
      status: Status.ACTIVE
    });
  }
};
