import { hash } from './hash.helper';

describe('hash.helper', () => {
  it('should generate a consistent SHA-512 hash', () => {
    const token = 'test-token';
    const expected =
      '1fb3d3b3ed263ff715b48dfad17cc9e69697ccc59ba7c57922c7bc5e5312494542b788e22ce84463678e266e71ce0c401c9bdef9587b7c2a9d7dca4b38a031e8';
    expect(hash(token)).toBe(expected);
  });

  it('should generate different hashes for different tokens', () => {
    expect(hash('token1')).not.toBe(hash('token2'));
  });

  it('should have a length of 128 characters (hex SHA-512)', () => {
    expect(hash('any-token')).toHaveLength(128);
  });
});
