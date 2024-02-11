import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class DbEntityUser {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ name: 'password_hash', type: 'bytea' })
  passwordHash: Buffer;
}