import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Event } from '@/models';

export const eventApi = {
  getEvents: (search?: string) => {
    return httpRequest.get<Event[]>(API_ROUTE.event, {
      baseURL: process.env.EVENT_API_URL,
      params: {
        search
      }
    });
  },
  getEventsByOrganizerId: (organizerId: string) => {
    return httpRequest.get<Event[]>(`${API_ROUTE.event}/${organizerId}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  getEventById: (id: number) => {
    return httpRequest.get<Event>(`${API_ROUTE.event}/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  createEvent: (data: Partial<Event>) => {
    return httpRequest.post<any, Partial<Event>>(API_ROUTE.event, data, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  updateEvent: (id: number, data: Partial<Event>) => {
    return httpRequest.put<any, Partial<Event>>(
      `${API_ROUTE.event}/${id}`,
      data,
      {
        baseURL: process.env.EVENT_API_URL
      }
    );
  },
  deleteEvent: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  increaseFavourite: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/increase-favourite/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  decreaseFavourite: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/decrease-favourite/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  increaseShare: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/increase-share/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  },
  decreaseShare: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/decrease-share/${id}`, {
      baseURL: process.env.EVENT_API_URL
    });
  }
};
