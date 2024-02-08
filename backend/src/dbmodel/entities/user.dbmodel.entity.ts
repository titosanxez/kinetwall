import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class DbEntityUser {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ name: 'password_hash', type: 'bytea' })
  passwordHash: Buffer;
}