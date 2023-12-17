import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
  
  @Entity('punching_entry')
  export class PunchingEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
     entry_id: string;
     
     @Column({
        type:'varchar',
        name:'entry_date',
        nullable:true
      })
    Entry_Date:string;

    @Column({
        type:'varchar',
        name:'emp_id',
        nullable:false
    })
    Emp_id:string

    @Column({
        type:'varchar',
        name:'punch_in',
        nullable:true,
    })
    Punch_In:string
    @Column({
        type:'varchar',
        name:'punch_out',
        nullable:true,
    })
    Punch_Out:string
    
    @Column({
        type:'varchar',
        name:'entry_type',
        nullable:true
    })
    Entry_Type:string

    @Column({
        type:'varchar',
        name:'entry_status'
    })
    Entry_Status:string


    @Column({
        type: 'varchar',
        name: 'total_hours',
        nullable:true
    })
    Total_hours:string

    // @ManyToOne(() => EmployeeEntity, employee => employee.punch, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'id' })
    // Emp_id: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt!: Date;
    
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    public deletedAt!: Date;
    
  }
  