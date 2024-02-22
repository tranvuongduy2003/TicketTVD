import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import {
  CreateEventPayload,
  Event,
  FilteringOptions,
  HighlightEvent
} from '@/models';

export const eventApi = {
  getEvents: (options?: Partial<FilteringOptions>) => {
    return httpRequest.get<Event[]>(API_ROUTE.event, {
      params: options
    });
  },
  getNewestEvents: () => {
    return httpRequest.get<Event[]>(API_ROUTE.event + '/newest');
  },
  getUpcomingEvents: () => {
    return httpRequest.get<Event[]>(API_ROUTE.event + '/upcoming');
  },
  getHighlightEvent: () => {
    return httpRequest.get<HighlightEvent>(API_ROUTE.event + '/highlight');
  },
  getHighlightEventsList: () => {
    return httpRequest.get<Event[]>(API_ROUTE.event + '/highlight/list');
  },
  getRandomEvents: () => {
    return httpRequest.get<Event[]>(API_ROUTE.event + '/random');
  },
  createEvent: (data: CreateEventPayload) => {
    return httpRequest.post<any, CreateEventPayload>(API_ROUTE.event, data);
  },
  getEventsByOrganizerId: (
    organizerId: string,
    options?: Partial<FilteringOptions>
  ) => {
    return httpRequest.get<Event[]>(
      `${API_ROUTE.event}/event-by-organizer/${organizerId}`,
      {
        params: options
      }
    );
  },
  getEventById: (id: string) => {
    return httpRequest.get<Event>(`${API_ROUTE.event}/${id}`);
  },
  updateEvent: (id: string, data: CreateEventPayload) => {
    return httpRequest.put<any, CreateEventPayload>(
      `${API_ROUTE.event}/${id}`,
      data
    );
  },
  deleteEvent: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}`);
  },
  increaseFavourite: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}/increase-favourite`);
  },
  decreaseFavourite: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}/decrease-favourite`);
  },
  increaseShare: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}/increase-share`);
  },
  decreaseShare: (id: string) => {
    return httpRequest.delete(`${API_ROUTE.event}/${id}/decrease-share`);
  }
};
