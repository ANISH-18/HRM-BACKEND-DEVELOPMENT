import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { ToDo_Entity } from './todo.entity';
import { PunchingEntity } from './punching.entity';

@Entity('employee')
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'firstname',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'middlename',
    nullable: false,
  })
  middlename: string;

  @Column({
    type: 'varchar',
    name: 'lastname',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    name: 'officialemail',
    nullable: false,
  })
  officialEmail: string;

  @Column({
    type: 'varchar',
    name: 'emp_role',
    nullable: false,
  })
  emp_role: string;

  @Column({
    type: 'varchar',
    name: 'emp_positon',
    nullable: true
  })
  emp_positon: string;

  @Column({
    type: 'varchar',
    name: 'personalemail',
    nullable: true,
  })
  personalEmail: string;

  @Column({
    type: 'varchar',
    name: 'username',
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'skypeid',
    nullable: false,
  })
  skypeId: string;

  @Column({
    type: 'varchar',
    name: 'country_code',
    nullable: false,
  })
  country_code: string;

  @Column({
    type: 'varchar',
    name: 'phone_1',
    nullable: false,
  })
  phone_1: string;

  @Column({
    type: 'varchar',
    name: 'phone_2',
    nullable: true,
  })
  phone_2: string;

  @Column({
    type: 'varchar',
    name: 'maritualstatus',
    nullable: false,
  })
  maritualStatus: string;

  @Column({
    type: 'date',
    name: 'dob',
    nullable: true,
  })
  DOB: Date;

  @Column({
    type: 'date',
    name: 'doj',
    nullable: true,
  })
  DOJ: Date;

  @Column({
    type: 'varchar',
    name: 'permanentaddress',
    nullable: false,
  })
  permanentAddress: string;

  @Column({
    type: 'varchar',
    name: 'temp_address',
    nullable: true,
  })
  temp_address: string;

  @Column({
    type: 'varchar',
    name: 'city',
    nullable: false,
  })
  city: string;

  @Column({
    type: 'varchar',
    name: 'state',
    nullable: false,
  })
  state: string;

  @Column({
    type: 'varchar',
    name: 'country',
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    name: 'postalcode',
    nullable: false,
  })
  postalCode: string;

  @Column('text', { array: true, nullable: true })
  documents: string[];

  @Column({
    type: 'varchar',
    name: 'linkedinurl',
    nullable: true,
  })
  linkedInUrl: string;

  @Column({
    type: 'varchar',
    name: 'profilepic',
    nullable: true,
  })
  profilePic: string;

  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'text',
    name: 'reset_token',
    nullable: true,
  })
  resetToken: string;

  @Column({
    type: 'boolean',
    name: 'is_verified',
    nullable:true,
  })
  isVerified: boolean;

  @Column({
    name: 'last_login_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  public lastLoginAt: Date | null;

  // @OneToMany(() => ToDo_Entity, todo => todo.Emp_id)
  // ToDo: ToDo_Entity[];

  // @OneToMany(() => PunchingEntity, punch => punch.Emp_id)
  // punch: PunchingEntity[]

  /*
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  public updatedAt!: Date;
  
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt!: Date;
}
