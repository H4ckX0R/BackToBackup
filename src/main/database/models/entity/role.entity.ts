import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';

export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PermissionLevel, array: true })
  adminUsers: PermissionLevel[];

  @Column({ type: 'enum', enum: PermissionLevel, array: true })
  adminSystem: PermissionLevel[];

  @Column({ type: 'enum', enum: PermissionLevel, array: true })
  adminRoles: PermissionLevel[];

  @ManyToMany(() => UserEntity)
  users: UserEntity[];
}
