import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AuditableEntity } from '../../common/entities/auditable.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'magic_links' })
export class MagicLink extends AuditableEntity {
  @Index('idx_magic_links_token_hash', ['tokenHash'], { unique: true })
  @Column('char', { length: 128 })
  tokenHash: string;

  @Column('varchar', { length: 16 })
  actionType: 'login' | 'register';

  @Column('timestamptz')
  expiresAt?: Date;

  @Column('timestamptz', { nullable: true })
  usedAt?: Date;

  @ManyToOne(() => User, (user) => user.magicLinks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_magic_links_user' })
  user: User;

  @BeforeInsert()
  setExpiresAt() {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  }
}
