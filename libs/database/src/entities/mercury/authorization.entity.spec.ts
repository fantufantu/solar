import { AUTHORIZATION_RESOURCE_CODE } from './authorization.entity';

describe('AUTHORIZATION_RESOURCE_CODE', () => {
  test('补全系统中全部资源`code`', () => {
    expect(AUTHORIZATION_RESOURCE_CODE).toEqual({
      ALL: 'all',
      AUTHORIZATION: 'Authorization',
      ROLE: 'Role',
      USER: 'User',
      DICTIONARY: 'Dictionary',
      DICTIONARY_ENUM: 'DictionaryEnum',
      ATTRACTION: 'Attraction',
      MEMBERSHIP: 'Membership',
      DISTRICT: 'District',
      CATEGORY: 'Category',
      RESUME: 'Resume',
      RESUME_TEMPLATE: 'ResumeTemplate',
    });
  });
});
