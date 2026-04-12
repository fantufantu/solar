import {
  applyDecorators,
  RequestMethod,
  SetMetadata,
  Sse,
} from '@nestjs/common';
import { METHOD_METADATA } from '@nestjs/common/constants';

export const PostSse = (path: string) => {
  return applyDecorators(
    SetMetadata(METHOD_METADATA, RequestMethod.POST),
    Sse(path),
  );
};
