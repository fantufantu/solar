/// <reference types="jest" />
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Attraction } from '@/libs/database/entities/jupiter/attraction.entity';
import { AttractionService } from './attraction.service';
import { ATTRACTION_SYNC_ACTION } from './dto/sync-attractions.input';

function harness(initial: Partial<Attraction>[] = []) {
  const rows = new Map(
    initial.map((row) => [row.code!, Object.assign(new Attraction(), row)]),
  );
  const repository: any = {
    find: jest.fn(({ where }: any) =>
      Promise.resolve(
        where.code._value.map((code: string) => rows.get(code)).filter(Boolean),
      ),
    ),
    create: (value: any) => Object.assign(new Attraction(), value),
    upsert: jest.fn((values: Attraction[]) => {
      for (const value of values) rows.set(value.code, value);
      return Promise.resolve({ identifiers: values.map(({ code }) => ({ code })) });
    }),
    delete: jest.fn(({ code }: any) => {
      for (const attractionCode of code._value) rows.delete(attractionCode);
      return Promise.resolve({ affected: code._value.length });
    }),
  };
  return {
    repository,
    service: new AttractionService(repository),
    get: (code: string) => rows.get(code),
  };
}

const create = (code: string) => ({
  action: ATTRACTION_SYNC_ACTION.CREATE,
  code,
  name: code,
  districtCode: 'district-1',
  image: 'image',
});

describe('AttractionService sync', () => {
  it('creates, updates and deletes with the current user audit id', async () => {
    const h = harness([
      { code: 'update', name: 'old', districtCode: 'district-1', image: 'old' },
      { code: 'delete', name: 'gone', districtCode: 'district-1', image: 'old' },
    ]);
    await h.service.sync(
      {
        items: [
          create('create'),
          {
            action: ATTRACTION_SYNC_ACTION.UPDATE,
            code: 'update',
            name: 'new',
          },
          { action: ATTRACTION_SYNC_ACTION.DELETE, code: 'delete' },
        ],
      },
      'user-1',
    );
    expect(h.get('create')?.createdById).toBe('user-1');
    expect(h.get('update')).toMatchObject({ name: 'new', updatedById: 'user-1' });
    expect(h.get('delete')).toBeUndefined();
    expect(h.repository.find).toHaveBeenCalledTimes(1);
    expect(h.repository.upsert).toHaveBeenCalledTimes(1);
    expect(h.repository.delete).toHaveBeenCalledTimes(1);
  });

  it.each([ATTRACTION_SYNC_ACTION.UPDATE, ATTRACTION_SYNC_ACTION.DELETE])(
    'rejects %s for a missing attraction',
    async (action) => {
      const h = harness();
      await expect(
        h.service.sync({ items: [{ action, code: 'missing' }] }, 'user'),
      ).rejects.toBeInstanceOf(NotFoundException);
    },
  );

  it('rejects duplicate/conflicting operations before writing', async () => {
    const h = harness();
    await expect(
      h.service.sync(
        {
          items: [
            create('1'),
            { action: ATTRACTION_SYNC_ACTION.DELETE, code: '1' },
          ],
        },
        'user',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(h.repository.find).not.toHaveBeenCalled();
    expect(h.repository.upsert).not.toHaveBeenCalled();
    expect(h.repository.delete).not.toHaveBeenCalled();
  });
});
