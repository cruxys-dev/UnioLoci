import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<FastifyReply>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    };
  });

  it('should format simple string exception', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
    });
  });

  it('should format object exception with custom message', () => {
    const exception = new HttpException(
      { message: 'Custom error', error: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'Custom error',
    });
  });

  it('should format array of messages (validation errors)', () => {
    const exception = new HttpException(
      {
        message: ['email must be an email', 'name is too short'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.send).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'email must be an email, name is too short',
    });
  });
});
