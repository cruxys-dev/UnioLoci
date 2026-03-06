import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { CalendarMember } from './entities/calendar-members.entity';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: getRepositoryToken(Calendar),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CalendarMember),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
