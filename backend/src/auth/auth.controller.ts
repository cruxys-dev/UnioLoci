import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetSessionId } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  @HttpCode(HttpStatus.OK)
  magicLink(@Body() loginDto: LoginDto) {
    return this.authService.magicLink(loginDto);
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  callback(@Body('token') token: string, @Req() req: FastifyRequest) {
    return this.authService.callback(token, req);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetSessionId() sessionId: string) {
    return this.authService.logout(sessionId);
  }
}
