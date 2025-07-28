import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginatedInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<[unknown[], number]>,
  ) {
    return next.handle().pipe(
      map(({ 0: items, 1: total }) => {
        return {
          items,
          total,
        };
      }),
    );
  }
}
