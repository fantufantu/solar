/// <reference types="jest" />
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { District } from '@/libs/database/entities/jupiter/district.entity';
import { DistrictService } from './district.service';
import { DISTRICT_SYNC_ACTION } from './dto/sync-districts.input';

type Stored = District & { deletedAt: Date | null };

function harness(initial: Partial<Stored>[] = []) {
  const rows = new Map(
    initial.map((row) => [row.code!, Object.assign(new District(), row)]),
  );
  const repository: any = {
    find: jest.fn(({ where }: any) =>
      Promise.resolve(
        where.code._value.map((code: string) => rows.get(code)).filter(Boolean),
      ),
    ),
    create: (value: any) => Object.assign(new District(), value),
    upsert: jest.fn((values: Stored[]) => {
      for (const value of values) rows.set(value.code, value);
      return Promise.resolve({
        identifiers: values.map(({ code }) => ({ code })),
      });
    }),
    update: jest.fn(({ code }: any, value: Partial<Stored>) => {
      for (const districtCode of code._value) {
        Object.assign(rows.get(districtCode)!, value);
      }
      return Promise.resolve({ affected: code._value.length });
    }),
  };
  return {
    repository,
    service: new DistrictService(repository),
    get: (code: string) => rows.get(code),
  };
}

const create = (code: string) => ({
  action: DISTRICT_SYNC_ACTION.CREATE,
  code,
  name: code,
  level: 'city' as const,
  image: 'image',
});

describe('DistrictService sync', () => {
  it('creates, updates and soft-deletes with the current user audit id', async () => {
    const h = harness([
      { code: 'update', name: 'old', deletedAt: null },
      { code: 'delete', deletedAt: null },
    ]);
    await h.service.sync(
      {
        items: [
          create('create'),
          { action: DISTRICT_SYNC_ACTION.UPDATE, code: 'update', name: 'new' },
          { action: DISTRICT_SYNC_ACTION.DELETE, code: 'delete' },
        ],
      },
      'user-1',
    );
    expect(h.get('create')?.createdById).toBe('user-1');
    expect(h.get('update')).toMatchObject({
      name: 'new',
      updatedById: 'user-1',
    });
    expect(h.get('delete')?.updatedById).toBe('user-1');
    expect(h.get('delete')?.deletedAt).toBeInstanceOf(Date);
    expect(h.repository.find).toHaveBeenCalledTimes(1);
    expect(h.repository.upsert).toHaveBeenCalledTimes(1);
    expect(h.repository.update).toHaveBeenCalledTimes(1);
  });

  it('restores a soft-deleted district and refreshes its data', async () => {
    const h = harness([{ code: '1', name: 'old', deletedAt: new Date() }]);
    await h.service.sync({ items: [create('1')] }, 'user-2');
    expect(h.get('1')).toMatchObject({
      name: '1',
      deletedAt: null,
      updatedById: 'user-2',
    });
  });

  it.each([DISTRICT_SYNC_ACTION.UPDATE, DISTRICT_SYNC_ACTION.DELETE])(
    'rejects %s for a missing district',
    async (action) => {
      const h = harness();
      await expect(
        h.service.sync({ items: [{ action, code: 'missing' }] }, 'user'),
      ).rejects.toBeInstanceOf(NotFoundException);
    },
  );

  it('rejects create for an active code', async () => {
    const h = harness([{ code: '1', deletedAt: null }]);
    await expect(
      h.service.sync({ items: [create('1')] }, 'user'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects duplicate/conflicting operations before writing', async () => {
    const h = harness();
    await expect(
      h.service.sync(
        {
          items: [
            create('1'),
            { action: DISTRICT_SYNC_ACTION.DELETE, code: '1' },
          ],
        },
        'user',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(h.get('1')).toBeUndefined();
    expect(h.repository.find).not.toHaveBeenCalled();
    expect(h.repository.upsert).not.toHaveBeenCalled();
    expect(h.repository.update).not.toHaveBeenCalled();
  });
});
