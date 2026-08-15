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
    findOne: jest.fn(({ where }: any) =>
      Promise.resolve(rows.get(where.code) ?? null),
    ),
    findOneBy: jest.fn(({ code }: any) => {
      const row = rows.get(code);
      return Promise.resolve(row && !row.deletedAt ? row : null);
    }),
    create: (value: any) => Object.assign(new District(), value),
    save: jest.fn((value: Stored) => {
      rows.set(value.code, value);
      return Promise.resolve(value);
    }),
    recover: jest.fn((value: Stored) => {
      value.deletedAt = null;
      return Promise.resolve(value);
    }),
    softRemove: jest.fn((value: Stored) => {
      value.deletedAt ||= new Date();
      rows.set(value.code, value);
      return Promise.resolve(value);
    }),
    createQueryBuilder: () => {
      let inserted: Stored;
      return {
        insert() {
          return this;
        },
        values(value: Stored) {
          inserted = value;
          return this;
        },
        async execute() {
          rows.set(inserted.code, inserted);
          return { identifiers: [{ code: inserted.code }] };
        },
      };
    },
  };
  return {
    service: new DistrictService(repository),
    get: (code: string) => rows.get(code),
  };
}

const create = (code: string) => ({
  action: DISTRICT_SYNC_ACTION.create,
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
          { action: DISTRICT_SYNC_ACTION.update, code: 'update', name: 'new' },
          { action: DISTRICT_SYNC_ACTION.delete, code: 'delete' },
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

  it.each([DISTRICT_SYNC_ACTION.update, DISTRICT_SYNC_ACTION.delete])(
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
            { action: DISTRICT_SYNC_ACTION.delete, code: '1' },
          ],
        },
        'user',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(h.get('1')).toBeUndefined();
  });
});
