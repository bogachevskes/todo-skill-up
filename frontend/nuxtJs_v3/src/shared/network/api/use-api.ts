import { useRuntimeConfig } from '#imports';

import { API_CONFIG } from './api-config';

export const useApi = async <TResponse>(
  url: string,
  params?: Parameters<typeof $fetch<TResponse>>[1],
): Promise<TResponse> => {
  const config = useRuntimeConfig();

  const apiFetch = $fetch.create({
    ...API_CONFIG,
    baseURL: config.public.apiUrl,
  });

  return apiFetch<TResponse>(url, params);
};
