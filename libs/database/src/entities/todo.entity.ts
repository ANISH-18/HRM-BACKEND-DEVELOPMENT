import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { TimesheetEntity } from './timesheet.entity';
import { ProjectEntity } from './project.entities';
import { EmployeeEntity } from './employee.entity';
@Entity('todo')
export class ToDo_Entity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    ToDo_Id: string;

    @Column({
      type: 'varchar',
      name: 'emp_id',
      nullable: false,
    })
    Emp_id: string;
  
    @Column({
      type: 'varchar',
      name: 'todo_date',
      nullable: false,
    })
    ToDo_Date: string;
  
    @Column({
      type: 'varchar',
      name: 'task',
      nullable: false,
    })
    Task: string;
      
    @Column({
      type: 'varchar',
      name: 'status',
      nullable: false,
    })
    Task_Status: string;
  
    @ManyToOne(() => ProjectEntity, project => project.ToDo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project_id: string;

    // @ManyToOne(() => EmployeeEntity, employee => employee.ToDo, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'id' })
    // Emp_id: string;

    @OneToMany(() => TimesheetEntity, timesheetEntity => timesheetEntity.ToDo_Id)
    timesheets: TimesheetEntity[];

  
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    public deletedAt!: Date;
    

}