import { validate } from 'class-validator';
import { LoginDto } from './login.dto';
import { plainToInstance } from 'class-transformer';

describe('LoginDto', () => {
  it('should fail if email is empty', async () => {
    const dto = plainToInstance(LoginDto, { email: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if email is invalid', async () => {
    const dto = plainToInstance(LoginDto, { email: 'not-an-email' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should pass if email is valid', async () => {
    const dto = plainToInstance(LoginDto, { email: 'test@example.com' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
