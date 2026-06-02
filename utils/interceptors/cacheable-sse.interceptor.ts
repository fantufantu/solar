import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  MessageEvent,
} from '@nestjs/common';
import { ReplaySubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class CacheableSseInterceptor implements NestInterceptor {
  private readonly cachedChannels = new Map<
    string,
    ReplaySubject<MessageEvent>
  >();

  intercept(_context: ExecutionContext, next: CallHandler<MessageEvent>) {
    const _originalUrl = _context.switchToHttp().getRequest().originalUrl;
    const _cachedChannel = this.cachedChannels.get(_originalUrl);

    if (_cachedChannel) {
      return _cachedChannel.asObservable();
    }

    let channel$: ReplaySubject<MessageEvent> | null =
      new ReplaySubject<MessageEvent>();
    this.cachedChannels.set(_originalUrl, channel$);

    return next.handle().pipe(
      tap((_message) => {
        channel$?.next(_message);
      }),
      finalize(() => {
        channel$?.complete();
        this.cachedChannels.delete(_originalUrl);
        channel$ = null;
      }),
    );
  }
}
