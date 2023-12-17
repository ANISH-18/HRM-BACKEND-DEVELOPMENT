import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateTimeSheetDto } from './dto/create-timesheet.dto';
import {
  PunchingRepository,
  TimesheetRepository,
  ToDo_Repository,
} from '@database';
import { CLOCK, status } from '@helpers';

import * as moment from 'moment';
import { parse } from 'date-fns';
import { Role } from '@helpers';
import { log } from 'console';

@Injectable()
export class TimesheetService {
  constructor(
    private readonly timesheeRepository: TimesheetRepository,
    private readonly todoRepository: ToDo_Repository,
    private readonly punchingRepo: PunchingRepository,
  ) {}

  async createTimesheet(
    ToDo_Id: string,
    input: CreateTimeSheetDto,
    Emp_id: string,
  ) {
    try {
      const date = new Date();
      const today = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const clockedData = await this.punchingRepo.findById(Emp_id, today);

      if (clockedData && clockedData.Entry_Status === CLOCK.OUT) {
        throw new ConflictException(
          'Cannot add timesheet. User is already clocked out.',
        );
      }
      //If Task is Completed then it will return this
      const records = await this.todoRepository.findById(ToDo_Id);
      if (records.Task_Status === status.Complete) {
        throw new ConflictException(
          'Task Already completed  Cannot Create Timesheet.',
        );
      }

      const startTime = new Date(input.start_time);
      const endTime = new Date(input.end_time);
      //   if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {

      if (startTime < endTime) {
        const totalTimeMilliseconds = endTime.getTime() - startTime.getTime();
        input.total_time = (totalTimeMilliseconds / (1000 * 60)).toString();

        const timelineData: CreateTimeSheetDto = {
          ...input,
          start_time: startTime,
          end_time: endTime,
          total_time: input.total_time,
          ToDo_Id: ToDo_Id,
          t_Date: today,
          Emp_id: Emp_id,
        };
        const timesheet = await this.timesheeRepository.save(timelineData);
        const user = await this.timesheeRepository.save(timesheet);

        return {
          message: 'TimeLine added Successfully...',
          data: user,
        };
      } else {
        throw new ConflictException('Select Time Properly.');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateTimesheet(timesheet_id: string, input: CreateTimeSheetDto) {
    try {
      const existingTodo = await this.timesheeRepository.findById(timesheet_id);
      const todoId = (existingTodo as any)?.ToDo_Id?.ToDo_Id || null;

      if (!existingTodo) {
        throw new BadRequestException('ToDo not found');
      }

      const records = await this.todoRepository.findById(todoId);

      if (records.Task_Status === '2') {
        throw new ConflictException(
          'Task Already completed  Cannot Update Timesheet.',
        );
      }

      const startTime = new Date(input.start_time);
      const endTime = new Date(input.end_time);
      if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
        const totalTimeMilliseconds = endTime.getTime() - startTime.getTime();
        input.total_time = (totalTimeMilliseconds / (1000 * 60)).toString();

        const timelineData: CreateTimeSheetDto = {
          ...input,
          start_time: startTime,
          end_time: endTime,
          total_time: input.total_time,
        };
        await this.timesheeRepository.update({ timesheet_id }, timelineData);
        const updatedToDo = await this.timesheeRepository.findOne({
          where: { timesheet_id },
        });

        return {
          message: 'ToDo Updated Succesfully',
          data: updatedToDo,
        };
      }
    } catch (err) {
      throw err;
    }
  }
  async deleteTimesheet(timesheet_id: string) {
    try {
      let deleteObj = await this.timesheeRepository.findById(timesheet_id);
      console.log(deleteObj, '33333333333');

      if (!deleteObj) {
        throw new BadRequestException('ToDo not found');
      }
      const todoId = (deleteObj as any)?.ToDo_Id?.ToDo_Id || null;

      const records = await this.todoRepository.findById(todoId);

      if (records.Task_Status === '2') {
        throw new ConflictException(
          'Task Already completed  Cannot Delete Timesheet.',
        );
      }

      const deletedAt = new Date();

      const afterDelte = await this.timesheeRepository.deleteTimesheet(
        timesheet_id,
        deletedAt,
      );
      console.log(afterDelte);

      return {
        message: 'Deleted Timesheet Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getTimesheet(date: string, emp_id: string) {
    try {
      if (!date) {
        throw new NotAcceptableException('Date is undeifned');
      }
      const formattedDate = new Date(date);
      console.log(formattedDate);

      const getTimesheet = await this.timesheeRepository.findTimesheet(
        emp_id,
        date,
      );
      return {
        message: 'Records ',
        data: getTimesheet,
      };
    } catch (error) {
      throw error;
    }
  }
}
