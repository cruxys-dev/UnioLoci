import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SoftDeleteableEntity } from '../../common/entities/soft-deleteable.entity';
import { Calendar } from '../../calendar/entities/calendar.entity';
import { EventLog } from './event-log.entity';

@Entity({ name: 'events' })
export class Event extends SoftDeleteableEntity {
  @Column('varchar')
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('timestamptz')
  startAt: Date;

  @Column('timestamptz')
  endAt: Date;

  @ManyToOne(() => Calendar, (calendar) => calendar.events, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_events_calendar' })
  calendar: Calendar;

  @OneToMany(() => EventLog, (eventLog) => eventLog.event)
  logs: EventLog[];
}
