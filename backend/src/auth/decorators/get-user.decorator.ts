import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { User } from '../../user/entities/user.entity';

type AuthRequest = FastifyRequest & { user: { user: User; sessionId: string } };

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user.user;

    return data ? user?.[data] : user;
  },
);

export const GetSessionId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user.sessionId;
  },
);
