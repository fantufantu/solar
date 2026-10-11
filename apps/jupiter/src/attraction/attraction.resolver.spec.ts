/// <reference types="jest" />
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { AttractionResolver } from './attraction.resolver';

describe('AttractionResolver', () => {
  it('protects syncAttractions with JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AttractionResolver.prototype.syncAttractions,
    );
    expect(guards).toContain(JwtAuthGuard);
  });

  it('passes the authenticated user id to the service', async () => {
    const service = { sync: jest.fn().mockResolvedValue(true) };
    const resolver = new AttractionResolver(service as never, {} as never);
    const input = { items: [] };
    await expect(
      resolver.syncAttractions(input, { id: 'user-1' } as never),
    ).resolves.toBe(true);
    expect(service.sync).toHaveBeenCalledWith(input, 'user-1');
  });
});
