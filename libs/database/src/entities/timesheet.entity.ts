import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ToDo_Entity } from './todo.entity';
@Entity('timesheet')
export class TimesheetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  timesheet_id: string;

  @Column({
    type: 'varchar',
    name: 'emp_id',
    nullable: true,
  })
  Emp_id: string;

  @Column({
    type: 'timestamp',
    name: 'start_time',
    nullable: false,
  })
  start_time: Date;

  @Column({
    type: 'timestamp',
    name: 'end_time',
    nullable: false,
  })
  end_time: Date;

  @Column({
    type: 'varchar',
    name: 'total_time',
    nullable: true,
  })
  total_time: string;

  @Column({
    type: 'varchar',
    name: 't_date',
    nullable: true,
  })
  t_Date: string;

  @ManyToOne(() => ToDo_Entity, (todo) => todo.timesheets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ToDo_Id' })
  ToDo_Id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
}
