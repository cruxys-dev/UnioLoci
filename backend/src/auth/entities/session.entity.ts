import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AuditableEntity } from '../../common/entities/auditable.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'sessions' })
export class Session extends AuditableEntity {
  @Index('idx_sessions_token_hash', ['tokenHash'], { unique: true })
  @Column('char', { length: 128 })
  tokenHash!: string;

  @Column('timestamptz')
  expiresAt!: Date;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_sessions_user' })
  user!: User;
}
