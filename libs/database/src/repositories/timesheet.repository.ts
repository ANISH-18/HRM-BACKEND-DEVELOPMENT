import { InjectRepository } from '@nestjs/typeorm';
import { TimesheetEntity } from '@database/entities';
import { Between, FindManyOptions, Repository } from 'typeorm';

export class TimesheetRepository extends Repository<TimesheetEntity> {
  constructor(
    @InjectRepository(TimesheetEntity)
    private TimesheetRepository: Repository<TimesheetEntity>,
  ) {
    super(
      TimesheetRepository.target,
      TimesheetRepository.manager,
      TimesheetRepository.queryRunner,
    );
  }

  async findById(timesheet_id: string) {
    return await this.TimesheetRepository.createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.ToDo_Id', 'Todo')
      .select([
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.total_time',
        'timesheet.deleted_at',
        'Todo.ToDo_Id',
      ])
      .where('timesheet.timesheet_id = :timesheet_id', { timesheet_id })
      .getOneOrFail();
  }

  async findByToDo(Todo_Id: string) {
    return this.TimesheetRepository.createQueryBuilder('timesheet')
      .where('timesheet.ToDo_Id = :Todo_Id', { Todo_Id }) // Use $1 as a placeholder
      .getMany();
  }

  async deleteTimesheet(timesheet_id: string, deletedAt: Date) {
    return this.TimesheetRepository.update(
      { timesheet_id: timesheet_id }, // Criteria to match the record
      { deletedAt: deletedAt },
    );
  }

  //GET TIMESHEET WITH TODO
  //TIMESHEET API PAGE
  async findTimesheet(emp_id: string, date: string) {
    return await this.TimesheetRepository.createQueryBuilder('timesheet')
      .leftJoinAndSelect('timesheet.ToDo_Id', 'todo') // Update this line
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('timesheet.Emp_id = :emp_id', { emp_id }) // Adjust property names if needed
      .andWhere('timesheet.t_Date = :t_Date', { t_Date: date })
      .andWhere('timesheet.deleted_at IS NULL')
      .select([
        'timesheet.timesheet_id',
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.total_time',
        'timesheet.t_Date',
        'todo.ToDo_Id',
        'todo.Task',
        'todo.Task_Status',
        'todo.ToDo_Date',
        'project.project_id',
        'project.project_name',
      ])
      .getMany();
  }
}
