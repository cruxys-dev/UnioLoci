import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { CalendarMember } from './entities/calendar-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, CalendarMember])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [TypeOrmModule, CalendarService],
})
export class CalendarModule {}
