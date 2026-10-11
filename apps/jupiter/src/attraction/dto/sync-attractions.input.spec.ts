/// <reference types="jest" />
import { validate } from 'class-validator';
import {
  ATTRACTION_SYNC_ACTION,
  SyncAttractionInput,
  SyncAttractionsInput,
} from './sync-attractions.input';

const item = (values: Partial<SyncAttractionInput>) =>
  Object.assign(new SyncAttractionInput(), values);

describe('SyncAttractionsInput', () => {
  it('uses lowercase values for attraction sync actions', () => {
    expect(Object.values(ATTRACTION_SYNC_ACTION)).toEqual([
      'create',
      'update',
      'delete',
    ]);
  });

  it('rejects an empty list and duplicate codes', async () => {
    const input = Object.assign(new SyncAttractionsInput(), {
      items: [] as SyncAttractionInput[],
    });
    expect(await validate(input)).not.toHaveLength(0);

    input.items = [
      item({ action: ATTRACTION_SYNC_ACTION.DELETE, code: '1' }),
      item({ action: ATTRACTION_SYNC_ACTION.UPDATE, code: '1' }),
    ];
    expect(await validate(input)).not.toHaveLength(0);
  });

  it('requires create fields but permits a code-only delete', async () => {
    expect(
      await validate(
        item({
          action: ATTRACTION_SYNC_ACTION.CREATE,
          code: '1',
          name: 'Test attraction',
          districtCode: 'district-1',
          image: 'image',
        }),
      ),
    ).toHaveLength(0);
    expect(
      await validate(
        item({ action: ATTRACTION_SYNC_ACTION.CREATE, code: '1' }),
      ),
    ).not.toHaveLength(0);
    expect(
      await validate(item({ action: ATTRACTION_SYNC_ACTION.DELETE, code: '1' })),
    ).toHaveLength(0);
  });

  it('rejects actions outside the attraction sync action enum', async () => {
    expect(
      await validate(
        item({ action: 'UPSERT' as never, code: '1' }),
      ),
    ).not.toHaveLength(0);
  });
});
