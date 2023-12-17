import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ToDo_Entity } from './todo.entity';
import { ClientEntity } from './client.entity';

@Entity('project')
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  project_id: string;

  @Column({
    type: 'varchar',
    name: 'project_name',
    nullable: false,
  })
  project_name: string;

  @Column({
    type: 'varchar',
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    name: 'project_manager',
    nullable: false,
  })
  project_Manager: string;

  // @Column({
  //   type: 'varchar',
  //   name: 'client_id',
  //   nullable: false,
  // })
  // client_id: string;

  @Column({
    type: 'date',
    name: 'start_date',
    nullable: true,
  })
  start_date: Date;

  @Column({
    type: 'date',
    name: 'end_date',
    nullable: true,
  })
  end_date: Date;

  @ManyToOne(() => ClientEntity, client => client.project_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client_id: string;

  @OneToMany(() => ToDo_Entity, todo => todo.project_id)
  ToDo: ToDo_Entity[];

 
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;
  
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
  
}
