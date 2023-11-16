import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Event } from '@/models';

export const eventApi = {
  getEvents: () => {
    return httpRequest.get<Event[]>(API_ROUTE.event, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  getEventById: (id: number) => {
    return httpRequest.get<Event>(`${API_ROUTE.event}/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  updateEvent: (id: number, data: Partial<Event>) => {
    return httpRequest.put(`${API_ROUTE.event}/${id}`, data, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  deleteEvent: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  }
};
