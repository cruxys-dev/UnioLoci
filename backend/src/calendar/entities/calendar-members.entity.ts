import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Calendar } from './calendar.entity';

@Entity('calendar_members')
export class CalendarMember {
  @PrimaryColumn('uuid', {
    primaryKeyConstraintName: 'pk_calendar_members_user_id',
  })
  userId: string;

  @PrimaryColumn('uuid', {
    primaryKeyConstraintName: 'pk_calendar_members_user_id',
  })
  calendarId: string;

  @ManyToOne(() => User, (user) => user.calendarMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_calendar_members_user',
  })
  user: User;

  @ManyToOne(() => Calendar, (calendar) => calendar.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'calendarId',
    foreignKeyConstraintName: 'fk_calendar_members_calendar',
  })
  calendar: Calendar;

  @Column({ type: 'int', default: 30 })
  reminderMinutesBefore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
