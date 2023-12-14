import httpRequest from '@/api-client/httpRequest';
import { API_ROUTE } from '@/constants';
import { EventStatistic, Revenue } from '@/models';

export const statisticApi = {
  getRevenueInYear: () => {
    return httpRequest.get<Revenue[]>(API_ROUTE.statistic + '/general');
  },
  getEventsByCategory: () => {
    return httpRequest.get<EventStatistic[]>(
      API_ROUTE.event + '/statistic-by-category'
    );
  }
};
