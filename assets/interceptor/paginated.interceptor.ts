import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginatedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<[unknown[], number]>) {
    return next.handle().pipe(
      map(([items, total]) => {
        return {
          items,
          total,
        };
      }),
    );
  }
}
