import { Entity, Column } from 'typeorm';
import BaseEntity from './BaseEntity';

@Entity()
export default class UserData extends BaseEntity {
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;
}
