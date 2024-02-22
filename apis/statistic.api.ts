import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import {
  EventStatistic,
  EventsStatistic,
  GeneralStatistic,
  PaymentsStatistic,
  Revenue
} from '@/models';

export const statisticApi = {
  getGeneralStatistic: () => {
    return httpRequest.get<GeneralStatistic>(API_ROUTE.statistic + '/general');
  },
  getRevenueInYear: () => {
    return httpRequest.get<Revenue[]>(API_ROUTE.statistic + '/revenue');
  },
  getEventsByCategory: () => {
    return httpRequest.get<EventStatistic[]>(
      API_ROUTE.statistic + '/events-by-category'
    );
  },
  getEventsStatistic: () => {
    return httpRequest.get<EventsStatistic>(`${API_ROUTE.statistic}/event`);
  },
  getEventsStatisticByOrganizer: (organizerId: string) => {
    return httpRequest.get<EventsStatistic>(
      `${API_ROUTE.statistic}/event/${organizerId}`
    );
  },
  getPaymentsStatistic: (eventId: string) => {
    return httpRequest.get<PaymentsStatistic>(
      `${API_ROUTE.statistic}/payment/${eventId}`
    );
  }
};
