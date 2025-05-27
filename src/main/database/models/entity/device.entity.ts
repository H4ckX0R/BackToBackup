import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  hostname: string;

  @Column()
  os: string;

  @ManyToOne(() => UserEntity, (user) => user.devices)
  owner: UserEntity;
}
