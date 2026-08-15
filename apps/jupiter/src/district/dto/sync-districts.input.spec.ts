/// <reference types="jest" />
import { validate } from 'class-validator';
import {
  DISTRICT_SYNC_ACTION,
  SyncDistrictInput,
  SyncDistrictsInput,
} from './sync-districts.input';

const item = (values: Partial<SyncDistrictInput>) =>
  Object.assign(new SyncDistrictInput(), values);

describe('SyncDistrictsInput', () => {
  it('uses lowercase values for district sync actions', () => {
    expect(Object.values(DISTRICT_SYNC_ACTION)).toEqual([
      'create',
      'update',
      'delete',
    ]);
  });

  it('rejects an empty list and duplicate codes', async () => {
    const input = Object.assign(new SyncDistrictsInput(), {
      items: [] as SyncDistrictInput[],
    });
    expect(await validate(input)).not.toHaveLength(0);

    input.items = [
      item({ action: DISTRICT_SYNC_ACTION.delete, code: '1' }),
      item({ action: DISTRICT_SYNC_ACTION.update, code: '1' }),
    ];
    expect(await validate(input)).not.toHaveLength(0);
  });

  it('requires create fields but permits a code-only delete', async () => {
    expect(
      await validate(item({ action: DISTRICT_SYNC_ACTION.create, code: '1' })),
    ).not.toHaveLength(0);
    expect(
      await validate(item({ action: DISTRICT_SYNC_ACTION.delete, code: '1' })),
    ).toHaveLength(0);
  });

  it('rejects actions outside the district sync action enum', async () => {
    const input = item({
      action: 'UPSERT' as never,
      code: '1',
    });

    expect(await validate(input)).not.toHaveLength(0);
  });
});
