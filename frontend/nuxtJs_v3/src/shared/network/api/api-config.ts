import { useCookie } from '#imports';

import type { FetchOptions, FetchResponse } from 'ofetch';

type ErrorCausePayload = {
  cause?: string;
};

type ErrorPayload = {
  _data?: ErrorCausePayload;
};

export const API_CONFIG = {
  async onRequest({ options }: { options: FetchOptions }): Promise<void> {
    const token = useCookie('token');

    if (Boolean(options.headers) === false) {
      options.headers = new Headers();
    }

    if (Boolean(token.value) === true) {
      options.headers = {
        ...(options.headers || {}),
        'x-base-auth': String(token.value),
      };
    }
  },

  onResponse({ response }: { response: FetchResponse<unknown> }): unknown {
    return response._data;
  },

  async onResponseError({ response }: { response: FetchResponse<unknown> }): Promise<never> {
    const payload = response as ErrorPayload;
    const messageText = payload._data?.cause || 'Ошибка запроса';

    return Promise.reject(messageText);
  },
};
