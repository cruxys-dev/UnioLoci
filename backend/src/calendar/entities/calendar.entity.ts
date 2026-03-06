import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SoftDeleteableEntity } from '../../common/entities/soft-deleteable.entity';
import { User } from '../../user/entities/user.entity';
import { CalendarMember } from './calendar-members.entity';
import { Event } from '../../event/entities/event.entity';

@Entity({ name: 'calendars' })
export class Calendar extends SoftDeleteableEntity {
  @Column('varchar')
  name: string;

  @Column('boolean', { default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.calendars, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_calendars_creator' })
  creator: User;

  @OneToMany(() => Event, (event) => event.calendar)
  events: Event[];

  @OneToMany(() => CalendarMember, (cm) => cm.calendar)
  members: CalendarMember[];
}
