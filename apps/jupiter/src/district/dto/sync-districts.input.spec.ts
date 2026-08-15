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
  it('rejects an empty list and duplicate codes', async () => {
    const input = Object.assign(new SyncDistrictsInput(), {
      items: [] as SyncDistrictInput[],
    });
    expect(await validate(input)).not.toHaveLength(0);

    input.items = [
      item({ action: DISTRICT_SYNC_ACTION.DELETE, code: '1' }),
      item({ action: DISTRICT_SYNC_ACTION.UPDATE, code: '1' }),
    ];
    expect(await validate(input)).not.toHaveLength(0);
  });

  it('requires create fields but permits a code-only delete', async () => {
    expect(
      await validate(item({ action: DISTRICT_SYNC_ACTION.CREATE, code: '1' })),
    ).not.toHaveLength(0);
    expect(
      await validate(item({ action: DISTRICT_SYNC_ACTION.DELETE, code: '1' })),
    ).toHaveLength(0);
  });
});
