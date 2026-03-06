import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventLog } from './entities/event-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventLog])],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
