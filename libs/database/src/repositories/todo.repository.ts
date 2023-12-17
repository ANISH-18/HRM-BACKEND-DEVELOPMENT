import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { ToDo_Entity } from '@database/entities';
import { status } from '@helpers';

export class ToDo_Repository extends Repository<ToDo_Entity> {
  constructor(
    @InjectRepository(ToDo_Entity)
    private ToDoRepository: Repository<ToDo_Entity>,
  ) {
    super(
      ToDoRepository.target,
      ToDoRepository.manager,
      ToDoRepository.queryRunner,
    );
  }

  //FIND TODO BY ID
  async findById(ToDo_Id: string): Promise<ToDo_Entity> {
    return this.ToDoRepository.findOneBy({ ToDo_Id });
  }

  async findByIdWithProject(ToDo_Id: string) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.ToDo_Id = :ToDo_Id', { ToDo_Id })
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'project.project_id',
        'project.project_name',
        'project.project_id',
        'project.project_name',
      ])
      .getOne();
  }

  async findEarliestDate() {
    const earliestDate = await this.ToDoRepository.createQueryBuilder('todo')
      .select('MIN(toDo.ToDo_Date)', 'earliestDate')
      .getRawOne();

    return earliestDate.earliestDate;
  }
  //
  async findByDate(emp_id: string, todo_Date: string) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.emp_id = :emp_id', { emp_id })
      .andWhere('todo.ToDo_Date= :todo_Date', { todo_Date })
      // .andWhere(
      //   "(todo.ToDo_Date = :Todo_Date OR (todo.ToDo_Date < :Todo_Date AND (todo.ToDo_Date + INTERVAL '1 DAY')::date = :Todo_Date))",
      //   { todo_Date },
      // )
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'project.project_id',
        'project.project_name',
        'timesheet.timesheet_id',
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.total_time',
      ])
      .getMany();
    // .select([
    //   'todo.ToDo_Id',
    //   'todo.Task',
    //   'todo.ToDo_Date',
    //   'todo.Task_Status',
    //   'project.project_id',
    //   'project.project_name',
    //   'timesheet.start_time',
    //   'timesheet.end_time',
    //   '(SELECT SUM(CAST(timesheet.total_time AS decimal)) FROM timesheet timesheet WHERE timesheet.ToDo_Id = todo.ToDo_Id) as total_time_sum',
    // ])
    // .getRawMany();
  }

  async TimesheetBetweenDates(
    emp_id: string,
    Start_On: string,
    Finished_On: string,
  ) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .where('todo.emp_id = :emp_id', { emp_id })
      .andWhere('todo.ToDo_Date BETWEEN :startDate AND :endDate', {
        startDate: Start_On,
        endDate: Finished_On,
      })
      .orderBy('todo.ToDo_Date', 'DESC')
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.total_time',
      ])
      .getMany();
  }
  async findBetweenDatesWithEmp(
    emp_id: string,
    startDate: string,
    endDate: string,
  ) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.emp_id = :emp_id', { emp_id })
      .andWhere('todo.ToDo_Date BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      })
      .orderBy('todo.ToDo_Date', 'DESC')
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'todo.createdAt',
        'project.project_id',
        'project.project_name',
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.total_time',
      ])
      .getMany();
  }

  async findByEmpId(emp_id: string, ToDo_id: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Id: ToDo_id,
      },
    });
  }

  async findByStatus(emp_id: string, TodayFormatted: string, status: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Date: TodayFormatted,
        Task_Status: status,
      },
    });
  }
  async findByStatusByDate(emp_id: string, todo_Date: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Date: todo_Date,
      },
    });
  }
  async findTask(emp_id: string, todo_Date: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Date: todo_Date,
        Task_Status: Not('3'),
      },
    });
  }
  async findTaskDeleted(emp_id: string, status: string, todo_Date: string) {
    // return await this.ToDoRepository.find({
    //   where: {
    //         Emp_id: emp_id,
    //         ToDo_Date: todo_Date,
    //         Task_Status: status,
    //         deletedAt:Not(IsNull()),
    //   }
    // })
    return await this.ToDoRepository.query(
      `SELECT * FROM todo WHERE "emp_id" = $1 AND "todo_date" = $2 AND "status" = $3 AND "deleted_at" IS NOT NULL`,
      [emp_id, todo_Date, status],
    );
  }

  async findByTodoId(ToDo_Id: string) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.ToDo_Id = :ToDo_Id', { ToDo_Id })
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'project.project_id',
        'project.project_name',
        'timesheet.start_time',
        'timesheet.createdAt',
        'timesheet.end_time',
        'timesheet.total_time',
      ])
      .getMany();
  }

  async getTaskList(emp_id: string, today: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Date: today,
      },
    });
  }

  async findByName(Task: string, project_id: string, Emp_id: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: Emp_id,
        Task: Task,
        project_id: project_id,
      },
    });
  }

  async findByEmp() {
    return this.ToDoRepository.find();
  }

  // async getTaskListToday(
  //   emp_id: string,
  //   todayDate: string,
  //   taskStatus: string,
  // ) {
  //   return await this.ToDoRepository.find({
  //     where: {
  //       Emp_id: emp_id,
  //       ToDo_Date: todayDate,
  //       Task_Status: taskStatus,
  //     },
  //   });
  // }

  //IMP 13DEC ANIRUDDHA
  async getTaskListToday(emp_id: string, date: string, status: string) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.emp_id = :emp_id', { emp_id })
      .andWhere('todo.ToDo_Date = :todo_Date')
      .andWhere('todo.status = :status')
      .andWhere('todo.deleted_at IS NULL')
      .setParameter('todo_Date', date)
      .setParameter('status', status)
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'project.project_id',
        'project.project_name',
        'timesheet.timesheet_id',
        'timesheet.start_time',
        'timesheet.end_time',
        'timesheet.createdAt',
        'timesheet.total_time',
      ])
      .getMany();
  }

  //IMP 13DEC ANIRUDDHA
  async getTaskOverdue(emp_id: string, date: string, status: string) {
    return await this.ToDoRepository.createQueryBuilder('todo')
      .leftJoinAndSelect('todo.timesheets', 'timesheet')
      .leftJoinAndSelect('todo.project_id', 'project')
      .where('todo.emp_id = :emp_id', { emp_id })
      .andWhere('todo.status = :status') // Filtering for overdue status
      .andWhere('todo.deleted_at IS NULL')
      .setParameter('createdAt', date)
      .setParameter('status', status) // Setting status parameter
      .select([
        'todo.ToDo_Id',
        'todo.Task',
        'todo.ToDo_Date',
        'todo.Task_Status',
        'project.project_id',
        'project.project_name',
        'timesheet.start_time',
        'timesheet.createdAt',
        'timesheet.end_time',
        'timesheet.total_time',
      ])
      .getMany();
  }

  //FOR MARK-OVERDUE
  async findInProgressTask(emp_id: string, today: string, status: string) {
    return await this.ToDoRepository.find({
      where: {
        Emp_id: emp_id,
        ToDo_Date: today,
        Task_Status: status,
      },
    });
  }
}
