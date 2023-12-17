import { EmployeeRepository } from './employee.repository';
import { ClientRepository } from './client.repository';
import { ProjectRepository } from './project.repository';
import { PunchingRepository } from './punching.repository';
import { TimesheetRepository } from './timesheet.repository';
import { ToDo_Repository } from './todo.repository';


export const repositories = [
  EmployeeRepository,
  ClientRepository,
  ProjectRepository,
  PunchingRepository,
  ToDo_Repository,
  TimesheetRepository,
];

export * from './todo.repository'
export * from './employee.repository';
export * from './client.repository';
export * from './project.repository';
export * from './punching.repository';
export * from './todo.repository';
export * from './timesheet.repository';
