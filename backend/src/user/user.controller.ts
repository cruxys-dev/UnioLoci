import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { responser } from '../auth/responser.helper';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: User) {
    return responser(this.userService.getMe(user));
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(
    @GetUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return responser(await this.userService.update(id, updateUserDto));
  }
}
