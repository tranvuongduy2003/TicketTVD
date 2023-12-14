import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { Event } from '@/models';

export const eventApi = {
  getEvents: (search?: string) => {
    return httpRequest.get<Event[]>(API_ROUTE.event, {
      params: {
        search
      }
    });
  },
  getEventsByOrganizerId: (organizerId: string) => {
    return httpRequest.get<Event[]>(
      `${API_ROUTE.event}/event-by-organizer/${organizerId}`
    );
  },
  getEventById: (id: number) => {
    return httpRequest.get<Event>(`${API_ROUTE.event}/${id}`);
  },
  createEvent: (data: Partial<Event>) => {
    return httpRequest.post<any, Partial<Event>>(API_ROUTE.event, data);
  },
  updateEvent: (id: number, data: Partial<Event>) => {
    return httpRequest.put<any, Partial<Event>>(
      `${API_ROUTE.event}/${id}`,
      data
    );
  },
  deleteEvent: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}`);
  },
  increaseFavourite: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/increase-favourite/${id}`);
  },
  decreaseFavourite: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/decrease-favourite/${id}`);
  },
  increaseShare: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/increase-share/${id}`);
  },
  decreaseShare: (id: number) => {
    return httpRequest.delete(`${API_ROUTE.event}/decrease-share/${id}`);
  }
};
