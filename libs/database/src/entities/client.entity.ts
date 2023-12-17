import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectEntity } from './project.entities';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  client_id: string;

  @Column({
    type: 'varchar',
    name: 'client_first_name',
    nullable: false,
  })
  client_first_name: string;

  @Column({
    type: 'varchar',
    name: 'client_last_name',
    nullable: false,
  })
  client_last_name: string;

  @Column({
    type: 'varchar',
    name: 'company_name',
    nullable: false,
    unique: true,
  })
  company_name: string;

  @Column({
    type: 'varchar',
    name: 'company_website_link',
    nullable: true,
  })
  company_website_link: string;

  @Column({
    type: 'varchar',
    name: 'clientemail',
    nullable: false,
  })
  clientEmail: string;

  @Column({
    type: 'varchar',
    name: 'client_phone_1',
    nullable: false,
  })
  client_phone_1: string;

  @Column({
    type: 'varchar',
    name: 'client_phone_2',
    nullable: false,
  })
  client_phone_2: string;

  @Column({
    type: 'varchar',
    name: 'client_gst',
    nullable: false,
   })
  client_gst: string;

  @Column({
    type: 'varchar',
    name: 'client_pan',
    nullable: false,
  })
  client_pan: string;

  @Column({
    type: 'varchar',
    name: 'client_address',
    nullable: true,
  })
  client_address: string;

  @Column({
    type: 'varchar',
    name: 'client_city',
    nullable: false,
  })
  client_city: string;

  @Column({
    type: 'varchar',
    name: 'client_state',
    nullable: false,
  })
  client_state: string;

  @Column({
    type: 'varchar',
    name: 'client_country',
    nullable: false,
  })
  client_country: string;

  @Column({
    type: 'varchar',
    name: 'client_zip',
    nullable: false,
  })
  client_zip: string;

  @Column({
    type: 'varchar',
    name: 'client_language',
    nullable: true,
  })
  client_language: string;

  @Column({
    type: 'varchar',
    name: 'client_currency',
    nullable: false,
  })
  client_currency: string;

  @Column({
    type: 'varchar',
    name: 'client_reference',
    nullable: true,
  })
  client_reference: string;

  @Column({
    type: 'varchar',
    name: 'payment_method',
    nullable: false,
  })
  payment_method: string;

  @Column({
    type: 'varchar',
    name: 'client_coordinator_first_name',
    nullable: true,
  })
  client_coordinator_first_name: string;

  @Column({
    type: 'varchar',
    name: 'client_coordinator_last_name',
    nullable: true,
  })
  client_coordinator_last_name: string;

  @Column({
    type: 'varchar',
    name: 'client_coordinator_email',
    nullable: true,
     })
  client_coordinator_email: string;

  @Column({
    type: 'varchar',
    name: 'client_coordinator_phone',
    nullable: true,
   
  })
  client_coordinator_phone: string;

  @Column({
    type: 'varchar',
    name: 'accountant_first_name',
    nullable: true,
  })
  accountant_first_name: string;

  @Column({
    type: 'varchar',
    name: 'accountant_last_name',
    nullable: true,
  })
  accountant_last_name: string;

  @Column({
    type: 'varchar',
    name: 'accountant_email',
    nullable: true,
   
  })
  accountant_email: string;

  @Column({
    type: 'varchar',
    name: 'accountant_phone',
    nullable: true,
    
  })
  accountant_phone: string;

  @OneToMany(() => ProjectEntity, projectEntity => projectEntity.project_id)
  project_id: ProjectEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
}
