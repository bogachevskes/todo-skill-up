import { message } from 'ant-design-vue';

import { REQUEST_STATUS } from '@/shared/request';

export const checkErrorStatus = (status: string, messageText: string): void => {
  if (status === REQUEST_STATUS.ERROR) {
    message.error(messageText);
  }
};

export default checkErrorStatus;
