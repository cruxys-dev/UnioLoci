import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { TransferOwnershipDto } from './dto/transfer-ownership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { responser } from '../auth/responser.helper';

@Controller('calendars')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() createCalendarDto: CreateCalendarDto,
  ) {
    return responser(
      await this.calendarService.create(userId, createCalendarDto),
    );
  }

  @Get()
  async findAll(@GetUser('id') userId: string) {
    return responser(await this.calendarService.findAll(userId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return responser(await this.calendarService.findOne(id, userId));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    return responser(
      await this.calendarService.update(id, userId, updateCalendarDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    await this.calendarService.remove(id, userId);
    return responser({ success: true });
  }

  @Post(':id/join')
  async join(@Param('id') id: string, @GetUser('id') userId: string) {
    return responser(await this.calendarService.join(id, userId));
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string, @GetUser('id') userId: string) {
    await this.calendarService.leave(id, userId);
    return responser({ success: true });
  }

  @Post(':id/transfer')
  async transferOwnership(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() transferOwnershipDto: TransferOwnershipDto,
  ) {
    return responser(
      await this.calendarService.transferOwnership(
        id,
        userId,
        transferOwnershipDto,
      ),
    );
  }
}
