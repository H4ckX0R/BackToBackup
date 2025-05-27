import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
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
