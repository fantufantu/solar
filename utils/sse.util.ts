import { MessageEvent } from '@nestjs/common';
import { STATUS_CODE } from 'constants/sse.constant';

/**
 * Completed Message Event
 */
export const COMPLETED_MESSAGE_EVENT = (): MessageEvent => ({
  data: {
    statusCode: STATUS_CODE.SUCCESS,
  },
});
