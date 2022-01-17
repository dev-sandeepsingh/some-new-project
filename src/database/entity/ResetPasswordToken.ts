import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';
import BaseEntity from './BaseEntity';
import User from './User';

@Entity({ name: 'reset_password_token' })
export default class ResetPasswordToken extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({
    nullable: false,
  })
  expires: Date = new Date(Date.now() + 1000 * 60 * 60 * 24);

  @BeforeInsert()
  async hashPassword() {
    const bytes = await crypto.randomBytes(32);
    this.token = bytes.toString('hex');
  }
}
