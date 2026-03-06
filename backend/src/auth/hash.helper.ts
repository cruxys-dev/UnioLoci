import { createHash } from 'crypto';

export const hash = (token: string) => {
  return createHash('sha512').update(token).digest('hex');
};
