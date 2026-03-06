import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | undefined;
    let error: string;

    const defaultError =
      Object.keys(HttpStatus)
        .find(
          (key) =>
            (HttpStatus[key as keyof typeof HttpStatus] as unknown) === status,
        )

        ?.replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Internal Server Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = defaultError;
    } else {
      const res = exceptionResponse as {
        message: string | string[];
        error: string;
      };
      error = res.error || defaultError;
      if (res.message) {
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      }
    }

    if (message === error) {
      message = undefined;
    }

    const responseBody: {
      success: boolean;
      statusCode: number;
      error: string;
      message?: string;
    } = {
      success: false,
      statusCode: status,
      error,
    };

    if (message) {
      responseBody.message = message;
    }

    response.status(status).send(responseBody);
  }
}
