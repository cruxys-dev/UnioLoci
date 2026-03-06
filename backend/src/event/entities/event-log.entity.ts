import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuditableEntity } from '../../common/entities/auditable.entity';
import { Event } from './event.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'event_logs' })
export class EventLog extends AuditableEntity {
  @Column('varchar')
  action: 'create' | 'update' | 'delete';

  @Column('jsonb')
  changes: { before: Record<string, any>; after: Record<string, any> };

  @ManyToOne(() => Event, (event) => event.logs, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_event_logs_event' })
  event: Event;

  @ManyToOne(() => User, (user) => user.eventLogs, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_event_logs_user' })
  user: User;
}
