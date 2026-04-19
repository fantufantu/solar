import type { ValueOf } from '@aiszlab/relax/types';
import type { MessageEvent as _MessageType } from '@nestjs/common';
import type { STATUS_CODE } from 'constants/sse.constant';

export type StatusCode = ValueOf<typeof STATUS_CODE>;

export interface MessageEvent<T> extends Omit<_MessageType, 'data' | 'type'> {
  // 响应内容
  data: T;

  // 响应状态码
  type;
}
