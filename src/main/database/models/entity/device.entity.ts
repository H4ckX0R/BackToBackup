import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  hostname: string;

  @Column()
  os: string;

}
