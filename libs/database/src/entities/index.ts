import { EmployeeEntity } from './employee.entity';
import { ClientEntity } from './client.entity';
import { ProjectEntity } from './project.entities';
import { PunchingEntity } from './punching.entity';
import { ToDo_Entity } from './todo.entity';
import { TimesheetEntity } from './timesheet.entity';
export const entities = [
  EmployeeEntity,
  ClientEntity,
  ProjectEntity,
  PunchingEntity,
  ToDo_Entity,
  TimesheetEntity,
];

export * from './timesheet.entity'
export * from './employee.entity';
export * from './client.entity';
export * from './project.entities';
export * from './project.entities';
export * from './punching.entity';
export * from './todo.entity';
