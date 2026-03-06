import { Column, Entity, Index, OneToMany } from 'typeorm';
import { SoftDeleteableEntity } from '../../common/entities/soft-deleteable.entity';
import { MagicLink } from '../../auth/entities/magic-link.entity';
import { Session } from '../../auth/entities/session.entity';
import { Calendar } from '../../calendar/entities/calendar.entity';
import { CalendarMember } from '../../calendar/entities/calendar-members.entity';
import { EventLog } from '../../event/entities/event-log.entity';

@Entity({ name: 'users' })
export class User extends SoftDeleteableEntity {
  @Index('idx_users_email', ['email'], { unique: true })
  @Column('varchar')
  email: string;

  @Column('varchar', { nullable: true })
  name?: string;

  @Column('integer', { default: 50 })
  aiRequestsBalance: number;

  @OneToMany(() => MagicLink, (magicLink) => magicLink.user)
  magicLinks: MagicLink[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Calendar, (calendar) => calendar.creator)
  calendars: Calendar[];

  @OneToMany(() => CalendarMember, (cm) => cm.user)
  calendarMemberships: CalendarMember[];

  @OneToMany(() => EventLog, (eventLog) => eventLog.user)
  eventLogs: EventLog[];
}
