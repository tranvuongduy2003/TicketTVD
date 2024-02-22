import { statisticApi } from '@/apis';
import { QUERY_KEY } from '@/constants';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';

export function useGeneralStatistic(options?: Partial<SWRConfiguration>) {
  const {
    data: generalStatistic,
    error,
    mutate
  } = useSWR(
    QUERY_KEY.generalStatistic,
    async () => {
      const { data } = await statisticApi.getGeneralStatistic();
      return data;
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      keepPreviousData: true,
      ...options
    }
  );

  return {
    generalStatistic,
    mutate,
    error,
    isLoading: !error && !generalStatistic
  };
}
