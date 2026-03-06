import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateUserDto', () => {
  it('should pass with valid name', async () => {
    const dto = plainToInstance(UpdateUserDto, { name: 'John Doe' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass if name is omitted (optional)', async () => {
    const dto = plainToInstance(UpdateUserDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is too short', async () => {
    const dto = plainToInstance(UpdateUserDto, { name: 'A' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail if name is not a string', async () => {
    const dto = plainToInstance(UpdateUserDto, { name: 123 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
