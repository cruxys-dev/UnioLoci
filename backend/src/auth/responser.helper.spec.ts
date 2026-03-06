import { responser } from './responser.helper';

describe('responser.helper', () => {
  it('should return a successful response structure with default null entries', () => {
    const result = responser();
    expect(result).toEqual({
      success: true,
      entries: null,
      meta: undefined,
    });
  });

  it('should return entries when provided', () => {
    const entries = { id: 1, name: 'Test' };
    const result = responser(entries);
    expect(result.entries).toEqual(entries);
  });

  it('should return meta when provided', () => {
    const meta = { total: 10, page: 1 };
    const result = responser(null, meta);
    expect(result.meta).toEqual(meta);
  });
});
