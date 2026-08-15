/// <reference types="jest" />
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { DistrictResolver } from './district.resolver';

describe('DistrictResolver', () => {
  it('protects syncDistricts with JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      DistrictResolver.prototype.syncDistricts,
    );
    expect(guards).toContain(JwtAuthGuard);
  });

  it('passes the authenticated user id to the service', async () => {
    const service = { sync: jest.fn().mockResolvedValue(true) };
    const resolver = new DistrictResolver(service as never, {} as never);
    const input = { items: [] };
    await expect(
      resolver.syncDistricts(input, { id: 'user-1' } as never),
    ).resolves.toBe(true);
    expect(service.sync).toHaveBeenCalledWith(input, 'user-1');
  });
});
