import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import Role from '../../types';
import BaseEntity from './BaseEntity';

@Entity({ name: 'users' })
export default class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: Role.USER,
  })
  name: string;

  @Column({
    default: Role.USER,
  })
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
