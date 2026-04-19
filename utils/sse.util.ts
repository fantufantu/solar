import { STATUS_CODE } from 'constants/sse.constant';
import type { MessageEvent } from 'typings/sse.types';

/**
 * Completed Message Event
 */
export const COMPLETED_MESSAGE_EVENT = (): MessageEvent<null> => ({
  data: null,
  type: STATUS_CODE.SUCCESS,
});
