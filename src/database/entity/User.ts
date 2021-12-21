import { Role } from '../../types';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import BaseEntity from './BaseEntity';
import * as bcrypt from 'bcrypt';

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
    default: Role.USER
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
