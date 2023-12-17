import {
  EmployeeRepository,
  PunchingRepository,
  TimesheetRepository,
  ToDo_Repository,
} from '@database';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { updateToDoDto } from './dto/update-todo.dto';
import { ToDoDto } from './dto/create-todo.dto';
import * as moment from 'moment';

import * as schedule from 'node-schedule';

import { parse } from 'date-fns';
import { TimesheetService } from 'src/timesheet/timesheet.service';
import { status, taskFormat, LIMIT_VALUE } from '@helpers';
import { MailService } from '@mail/mail.service';
import { throwError } from 'rxjs';

@Injectable()
export class NewToDoService {
  constructor(
    private readonly toDoRepository: ToDo_Repository,
    private readonly punchingRepo: PunchingRepository,
    private mailService: MailService,
  ) {}

  //CREATE TODO
  async createToDo(input: ToDoDto, emp_id: string) {
    try {
      //Check Task Present or Not
      // const Todo= await this.toDoRepository.findByName(input.Task , input.project_id , emp_id)
      // console.log(Todo ,'kjlajdsgklsfjdlkgjslkjh')
      // if (Todo.length>0) {
      //   throw new ConflictException('Task already exists.');
      // }
      ///

      const date = new Date();
      input.ToDo_Date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

      // check  if that user Already clocked_out
      const clockedData = await this.punchingRepo.findById(
        emp_id,
        input.ToDo_Date,
      );
      console.log(clockedData, '***************');

      if (clockedData && clockedData.Entry_Status === '2') {
        throw new ConflictException(
          'Cannot add task. User is already clocked out.',
        );
      }

      input.Emp_id = emp_id;
      input.Task_Status = status.inProgress;
      console.log('@@@@@@@###############');

      let task = await this.toDoRepository.create(input);
      const todo = await this.toDoRepository.save(task);

      return {
        message: 'Task Added Successfully!',
        data: todo,
      };
    } catch (error) {
      throw error;
    }
  }

  //UPDATE TODO
  async updateToDo(ToDo_Id: string, update: updateToDoDto) {
    try {
      const existingTodo = await this.toDoRepository.findById(ToDo_Id);

      if (!existingTodo) {
        throw new BadRequestException('ToDo not found');
      }
      if (existingTodo.Task_Status == status.Complete) {
        throw new ConflictException(
          'The task you are attempting to update has already been completed.',
        );
      }
      await this.toDoRepository.update({ ToDo_Id }, update);
      const updatedToDo = await this.toDoRepository.findByIdWithProject(
        ToDo_Id,
      );

      return {
        message: 'Task Updated Successfully!',
        data: updatedToDo,
      };
    } catch (error) {
      throw error;
    }
  }

  //GETTOBYDATE FOR TIMESHEET PAGE API ONLY
  async getToDoByDate(emp_id: string, Todo_Date: string) {
    try {
      if (!Todo_Date) {
        throw new BadRequestException('Date field is required');
      }
      const Todo = await this.toDoRepository.findByDate(emp_id, Todo_Date);
      // const Todo - await this.toDoRepository.findByDate1(emp_id,Todo_Date)
      if (Todo.length == 0) {
        throw new NotFoundException('Data Not Found');
      }

      const count = Todo.length;

      const obj = {
        count,
        Todo,
      };

      return {
        message: `TODO list for this date ${Todo_Date} `,
        data: obj,
      };
    } catch (error) {
      throw error;
    }
  }

  //DELTE TODO
  async deleteToDo(todo_id: string) {
    try {
      const deleteObj = await this.toDoRepository.findById(todo_id);

      if (!deleteObj) {
        throw new BadRequestException('ToDo not found');
      }
      console.log(deleteObj.Task_Status, '&&&&&&&&&&&&&&&&&&&&&&&&');
      if (deleteObj.Task_Status === status.Complete) {
        throw new ConflictException(
          'The task you are attempting to delete has already been completed.',
        );
      }

      deleteObj.deletedAt = new Date();
      await this.toDoRepository.save(deleteObj);

      // const records= await this.timesheetRepo.findByToDo(deleteObj.ToDo_Id)

      // if (records && records.length > 0) {

      //   for (const timesheet of records) {
      //     if (!timesheet.deletedAt) {
      //       console.log(timesheet.timesheet_id,'948759834658734658765876')
      //       await this.timesheetService.deleteTimesheet(timesheet.timesheet_id);
      //     }
      //   }
      // }
      return {
        message: 'Task Deleted Succesfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  //UPDATE THE STATUS OF TODO
  async updateTodoStatus(ToDo_id: string) {
    try {
      console.log(ToDo_id);

      const checkStatus = await this.toDoRepository.findById(ToDo_id);

      if (checkStatus.Task_Status === status.Complete) {
        throw new ConflictException('Todo Already Marked As Completed.');
      }
      const TaskDetails = await this.toDoRepository.findByTodoId(
        checkStatus.ToDo_Id,
      );
      let cnt = 0;
      for (let i = 0; i < TaskDetails.length; i++) {
        if (TaskDetails[i].timesheets.length > 0) {
          cnt++;
        }
      }
      if (cnt === 0) {
        throw new ConflictException(
          'Please add  a timesheet before mark as complete.',
        );
      }

      checkStatus.Task_Status = status.Complete;

      const statusUpdated = await this.toDoRepository.save(checkStatus);

      return {
        message: 'Task Completed Succesfully!',
        data: statusUpdated,
      };
    } catch (error) {
      throw error;
    }
  }

  //task mark to overdue
  async markOverdue(emp_id: string) {
    try {
      const today = new Date();
      const todayDate = moment(today).format('YYYY-MM-DD');

      const inProgressTask = await this.toDoRepository.findInProgressTask(
        emp_id,
        todayDate,
        status.inProgress,
      );

      const updatedPromise = inProgressTask.map(async (task) => {
        task.Task_Status = status.Overdue;
        return this.toDoRepository.save(task);
      });

      await Promise.all(updatedPromise);
    } catch (error) {
      throw error;
    }
  }

  //TASKLIST BY STATUS
  //NO NEED
  async getTaskListByStatus(emp_id: string) {
    try {
      console.log(emp_id);
      console.log(emp_id);
      const Today = new Date();
      const TodayFormatted = await moment(Today).format('YYYY-MM-DD');

      const inProgressTask = await this.toDoRepository.findByStatus(
        emp_id,
        TodayFormatted,
        status.inProgress,
      );
      const Complete = await this.toDoRepository.findByStatus(
        emp_id,
        TodayFormatted,
        status.Complete,
      );
      const overDue = await this.toDoRepository.findByStatus(
        emp_id,
        TodayFormatted,
        status.Overdue,
      );

      const inProgressCount = inProgressTask.length;
      const CompleteCount = Complete.length;
      const overDueCount = overDue.length;

      const count = {
        inProgressCount: inProgressCount,
        CompleteCount: CompleteCount,
        overDueCount: overDueCount,
      };

      return {
        message: 'TaskList Success',
        data: {
          count: count || 0,
          inProgressTask: inProgressTask || [],
          Complete: Complete || [],
          overDue: overDue || [],
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //BETWEEN API
  //NO NEED
  async getBetween(emp_id: string, startDate: string, endDate: string) {
    try {
      if (!startDate || !endDate) {
        throw new NotFoundException(
          'Both start date and end date are required',
        );
      }

      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before finish date');
      }

      const dates = await this.toDoRepository.TimesheetBetweenDates(
        emp_id,
        startDate,
        endDate,
      );
      //     console.log(dates, '00000000000000000000');

      const datesCount = dates.length;

      if (datesCount === 0) {
        throw new NotFoundException('Records Not FOund');
      }

      const weeks = [];
      let currentWeek = [];
      for (let i = 0; i < dates.length; i++) {
        currentWeek.push(dates[i]);
        if (currentWeek.length === 7 || i === dates.length - 1) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (dates.length === 0) {
        return {
          message: 'No records found between the specified dates',
        };
      }

      const count = dates.length;
      const weekCount = weeks.length;

      const obj = {
        count,
        weekCount,
        weeks,
      };

      return {
        message: 'Records Fetched Successfully...',
        data: obj,
      };
    } catch (error) {
      throw error;
    }
  }

  isMonday(date: Date) {
    return date.getDay() === 1;
  }

  adjustToPreviousMonday(date: Date) {
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;
    return new Date(date.getTime() - diff * 24 * 60 * 60 * 1000);
  }
  isSameWeek(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const week1 = this.getWeekNumber(d1);
    const week2 = this.getWeekNumber(d2);

    return week1 === week2 && d1.getFullYear() === d2.getFullYear();
  }

  // Function to get the ISO week number
  getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);

    // Explicit type casting
    const diffTime = (d.getTime() - yearStart.getTime()) as number;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.ceil((diffDays + 1) / 7);
  }

  //TIMESHEET BY FORMAT
  //NO NEED
  async getTimesheetsByFormat(dateFormat: string, emp_id: string) {
    const currentDate = new Date();
    try {
      let startDate: string;
      let endDate: string;
      let date1: Date;
      let date2: Date;

      switch (dateFormat) {
        case 'week':
          date1 = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay(),
            0,
            0,
            0,
          );
          date2 = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
          );
          break;
        case 'yesterday':
          const yesterday = new Date(currentDate);
          yesterday.setDate(currentDate.getDate() - 1);
          date1 = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            0,
            0,
            0,
          );
          date2 = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            23,
            59,
            59,
          );
          break;
        case 'today':
          const today = new Date(currentDate);
          today.setDate(currentDate.getDate());
          date1 = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
          );
          date2 = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          );
          break;
        case 'month':
          date1 = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1,
            0,
            0,
            0,
          );
          date2 = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0,
            23,
            59,
            59,
          );
          break;
        case 'all':
          date1 = await this.toDoRepository.findEarliestDate();
          date2 = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0,
            23,
            59,
            59,
          );
          break;
        default:
          throw new Error('Invalid date format');
      }
      startDate = moment(date1).format('YYYY-MM-DD');
      endDate = moment(date2).format('YYYY-MM-DD');

      const records = await this.toDoRepository.findBetweenDatesWithEmp(
        emp_id,
        startDate,
        endDate,
      );

      const count = records.length;
      if (count === 0) {
        throw new NotFoundException('Records Not Found');
      }
      let cnt = 0;

      // Weekly
      const weeks = [];
      let currentWeek = [];
      for (let i = 0; i < count; i++) {
        if (
          currentWeek.length > 0 &&
          !this.isSameWeek(currentWeek[0].ToDo_Date, records[i].ToDo_Date)
        ) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }

        currentWeek.push(records[i]);

        if (currentWeek.length === 7 || i === count - 1) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }

        // if (records[i].Task_Status === '2') {
        //   cnt = cnt + 1;
        // }
      }

      const uniqueDatesSet = new Set();
      for (let i = 0; i < count; i++) {
        const currentDate = records[i].ToDo_Date;
        uniqueDatesSet.add(currentDate);
      }

      const uniqueDatesCount = uniqueDatesSet.size;
      const weekCount = weeks.length;

      const objweek = {
        week: weekCount,
        days: uniqueDatesCount,
        weeks,
      };

      //monthly
      const month = [];
      let currentMonth = [];
      for (let i = 0; i < weeks.length; i++) {
        currentMonth.push(weeks[i]);
        if (currentMonth.length === 4 || i === weeks.length - 1) {
          month.push(currentMonth);
          currentMonth = [];
        }
      }

      const monthCount = month.length;

      const obj = {
        months: monthCount,
        weeks: weekCount,
        // days: uniqueDatesCount,
        month,
      };

      if (dateFormat === 'week') {
        return {
          message: 'Records fetched and organized by weeks successfully',
          data: {
            //  completedTask: cnt,
            objweek,
          },
        };
      } else if (dateFormat === 'month') {
        return {
          message: 'Monthly Records Fetched Successfully...',
          data: obj,
        };
      } else if (dateFormat === 'all') {
        const days = {};

        for (const record of records) {
          const dateKey = moment(record.ToDo_Date).format('YYYY-MM-DD');

          if (!days[dateKey]) {
            days[dateKey] = [];
          }

          days[dateKey].push(record);
        }

        const weeks = [];
        const months = [];

        let currentWeek = [];
        let currentMonth = [];

        Object.keys(days).forEach((dateKey, index, array) => {
          const recordDate = moment(dateKey);

          currentWeek.push(...days[dateKey]);

          if (
            index === array.length - 1 ||
            recordDate.week() !== moment(array[index + 1]).week()
          ) {
            weeks.push([...currentWeek]);
            currentWeek = [];
          }

          if (
            currentMonth.length > 0 &&
            (recordDate.month() !== moment(currentMonth[0].ToDo_Date).month() ||
              recordDate.year() !== moment(currentMonth[0].ToDo_Date).year())
          ) {
            months.push([...currentMonth]);
            currentMonth = [];
          }

          currentMonth.push(...days[dateKey]);
        });

        if (currentMonth.length > 0) {
          months.push([...currentMonth]);
        }

        return {
          message: 'Records fetched and organized successfully',
          data: {
            months: months.length,
            // weeks: weeks.length,
            records: months,
          },
        };
      } else {
        return {
          message: 'Records fetched and organized successfully',
          data: records,
        };
      }
    } catch (err) {
      return err;
    }
  }

  //REMOVE ASSIGN TO DAY
  async assignToNextDay(Emp_id: string) {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    try {
      const inProgressTask = await this.toDoRepository.findByStatusByDate(
        Emp_id,
        today.toISOString().split('T')[0],
      );

      if (currentDayOfWeek === 5) {
        today.setDate(today.getDate() + 3);
      } else {
        today.setDate(today.getDate() + 1);
      }

      for (let i = 0; i < inProgressTask.length; i++) {
        if (
          inProgressTask[i].Task_Status === status.inProgress ||
          inProgressTask[i].Task_Status === status.Overdue
        ) {
          if (
            inProgressTask[i].ToDo_Date <= today.toISOString().split('T')[0]
          ) {
            let ToDo_Id = inProgressTask[i].ToDo_Id;
            inProgressTask[i].Task_Status = '3';
            inProgressTask[i].ToDo_Date = today.toISOString().split('T')[0];
            inProgressTask[i].updatedAt = today;
            await this.toDoRepository.update({ ToDo_Id }, inProgressTask[i]);
          }
        }
      }
    } catch (err) {
      return err;
    }
  }

  //TIMESHEET OF TODO ID
  async getTimesheetByTask(ToDo_Id: string) {
    try {
      if (!ToDo_Id) {
        throw new NotAcceptableException('Todo Id is undefined');
      }
      const date = new Date();
      const todayDate = moment(date).format('YYYY-MM-DD');

      const records = await this.toDoRepository.findByTodoId(ToDo_Id);
      let name: string;
      let status: string;
      let todaysTimesheet = [];
      let previousTimesheet = [];

      for (let i = 0; i < records.length; i++) {
        name = records[i].Task;
        status = records[i].Task_Status;
        if (records[i] && records[i].timesheets) {
          for (let j = 0; j < records[i].timesheets.length; j++) {
            if (
              records[i].timesheets[j] &&
              records[i].timesheets[j].createdAt !== undefined
            ) {
              let createdDate = moment(
                records[i].timesheets[j].createdAt,
              ).format('YYYY-MM-DD');

              if (createdDate === todayDate) {
                todaysTimesheet.push(records[i].timesheets[j]);
              } else {
                previousTimesheet.push(records[i].timesheets[j]);
              }
            }
          }
        }
      }
      return {
        data: {
          Task: name,
          status: status,
          timesheet: {
            Today: todaysTimesheet,
            Previous: previousTimesheet,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      throw error;
    }
  }

  //ANIRUDHDA 13 DEC TOday TaskList Done
  async taskListToday(emp_id: string) {
    try {
      let getInProgress: any[] = [];
      let getComplete: any[] = [];
      let getOverdues: any[] = [];

      const date = new Date();
      const todayDate = moment(date).format('YYYY-MM-DD');
      // const todayDate = '2023-12-14';
      getInProgress = await this.toDoRepository.getTaskListToday(
        emp_id,
        todayDate,
        status.inProgress,
      );
      getComplete = await this.toDoRepository.getTaskListToday(
        emp_id,
        todayDate,
        status.Complete,
      );
      getOverdues = await this.toDoRepository.getTaskOverdue(
        emp_id,
        todayDate,
        status.Overdue,
      );
      console.log('formated');

      //count
      const InProgressCount = getInProgress.length;
      const completeCount = getComplete.length;
      const overdueCount = getOverdues.length;

      const count = {
        inProgressCount: InProgressCount,
        CompleteCount: completeCount,
        overDueCount: overdueCount,
      };

      return {
        message: "Today's Task List",
        data: {
          count: count || 0,
          Inprogress: getInProgress,
          Completed: getComplete,
          Overdue: getOverdues,
        },
      };
    } catch (error) {
      throw error;
    }
    // console.log('EMP_ID', emp_id, 'FORMAT:', format);
  }

  //ANIRUDHDA 13 DEC  Yesterday TaskList Done
  async taskListYesterday(emp_id: string) {
    try {
      console.log('YESTERDAY');

      //Taking Date in the Yesterday from today's Date
      const today = moment();
      if (today.day() === 1) {
        today.subtract(3, 'days');
      } else {
        today.subtract(1, 'days');
      }
      const yesterdayDate = today.format('YYYY-MM-DD');

      //Extracting Yesterday's Complete and Overdue Task
      let getComplete: any[] = [];
      let getOverdues: any[] = [];

      getComplete = await this.toDoRepository.getTaskListToday(
        emp_id,
        yesterdayDate,
        status.Complete,
      );
      console.log(getComplete, '3333333');

      getOverdues = await this.toDoRepository.getTaskOverdue(
        emp_id,
        yesterdayDate,
        status.Overdue,
      );

      console.log(getOverdues, '3333333');
      const completeCount = getComplete.length;
      const overdueCount = getOverdues.length;

      const count = {
        CompleteCount: completeCount,
        overDueCount: overdueCount,
      };
      return {
        message: 'Yesterday Records ',
        data: {
          count: count || 0,
          Completed: getComplete,
          Overdue: getOverdues,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //ANIRUDDHA 13 DEC WEEK TaskList Done
  async taskListWeek(emp_id: string) {
    try {
      console.log('WEEK');

      const distinctDates = await this.punchingRepo.getDistinctDates(
        emp_id,
        LIMIT_VALUE.FIVE,
      );

      const weekRecords = [];

      for (const dateObj of distinctDates) {
        const currentDate = moment(dateObj.entry_date).format('YYYY-MM-DD');

        const tasks = await this.toDoRepository.getTaskListToday(
          emp_id,
          currentDate,
          status.Complete,
        );

        weekRecords.push(...tasks);
      }

      return {
        message: 'Week Records',
        data: { Completed: weekRecords },
      };
    } catch (error) {
      throw error;
    }
  }

  //helper method of taskListWeek
  async getCompletedTasksForDay(emp_id: string, date: string) {
    const completedTasksForDay = await this.toDoRepository.getTaskListToday(
      emp_id,
      date,
      status.Complete,
    );
    return completedTasksForDay;
  }
}
