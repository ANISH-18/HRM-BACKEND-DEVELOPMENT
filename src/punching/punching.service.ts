import { PunchingRepository, ToDo_Repository } from 'libs/database/src';

import { Injectable } from '@nestjs/common';
import { PunchingEntryDto } from './dto/create-punching.dto';
import { updatePunchingDto } from './dto/update-punching.dto';
import { NewToDoService } from 'src/ToDo/todo.service';
import { CLOCK, status, LIMIT_VALUE } from '@helpers';
import * as moment from 'moment';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common/exceptions';

@Injectable()
export class PunchingService {
  constructor(
    private readonly punchingRepository: PunchingRepository,
    private readonly todoRepository: ToDo_Repository,
    private readonly toDoService: NewToDoService,
  ) {}

  //PUNCH IN/OUT
  async punchIn(input: PunchingEntryDto, Emp_id: string) {
    try {
      const date = new Date();
      input.Entry_Date = await moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      //SHOULD BE EMPLOYEE REPOSITORY
      const existingEntry = await this.punchingRepository.findOne({
        where: { Emp_id, Entry_Date: input.Entry_Date },
      });

      //CLOCK OUT
      if (existingEntry) {
        if (
          existingEntry.Entry_Status == CLOCK.IN &&
          existingEntry.Entry_Date == input.Entry_Date
        ) {
          const TaskDetails = await this.todoRepository.findByDate(
            Emp_id,
            input.Entry_Date,
          );
          let cnt = 0;
          for (let i = 0; i < TaskDetails.length; i++) {
            if (TaskDetails[i].timesheets.length > 0) {
              cnt++;
            }
          }
          if (cnt == 0) {
            throw new ConflictException(
              'Please add  a timesheet before Clock Out.',
            );
          }

          const punchInTime = new Date(existingEntry.Punch_In);
          const punchOutTime = new Date();

          const timeDiff = punchOutTime.getTime() - punchInTime.getTime();
          const total_hours = Math.floor(timeDiff / (1000 * 60)).toString();

          //Update The Status of the Employee Attendance to Clock out
          existingEntry.Entry_Status = CLOCK.OUT;
          existingEntry.Punch_Out = await moment(punchOutTime).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          existingEntry.Total_hours = total_hours;

          await this.punchingRepository.update(
            { entry_id: existingEntry.entry_id },
            existingEntry,
          );
          const checkstatus = await this.punchingRepository.findOne({
            where: { Emp_id, Entry_Date: input.Entry_Date },
          });

          //overdue task
          // await this.toDoService.assignToNextDay(Emp_id);
          this.toDoService.markOverdue(Emp_id);

          return {
            message: 'Clock Out Succesful!',
            data: checkstatus.Entry_Status,
          };
        } else {
          throw new ConflictException('You have already clocked out.');
        }
      } else {
        //last clock out update
        // this.lastClockOut(Emp_id);
        const today = new Date();
        // const status = '1';
        const todoData = await this.todoRepository.findTask(
          Emp_id,
          today.toISOString().split('T')[0],
        );
        const deletedData = await this.todoRepository.findTaskDeleted(
          Emp_id,
          status.inProgress,
          today.toISOString().split('T')[0],
        );

        if (todoData.length == 0 && deletedData.length == 0) {
          throw new ConflictException('Please Add Atleast One Task.');
        } else {
          input.Entry_Status = CLOCK.IN;
          input.Emp_id = Emp_id;
          const Today = new Date();
          input.Punch_In = await moment(Today)
            .format('YYYY-MM-DD HH:mm:ss')
            .toString();

          const savedPunchingData = await this.punchingRepository.save(input);

          return {
            message: 'Clock In Succesful!',
            data: savedPunchingData,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  //NO INFO
  async lastClockOut(Emp_id: string) {
    try {
      const lastEntry = await this.punchingRepository.findOne({
        where: { Emp_id },
        order: { Entry_Date: 'DESC' },
      });
      if (!lastEntry.Punch_Out) {
        const punchInTime = new Date(lastEntry.Punch_In);
        const punchOutTime = new Date();
        const timeDiff = punchOutTime.getTime() - punchInTime.getTime();
        const total_hours = Math.floor(timeDiff / (1000 * 60)).toString();

        //Update The Status of the Employee Attendance to Clock out
        lastEntry.Entry_Status = CLOCK.OUT;
        lastEntry.Punch_Out = await moment(punchOutTime).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        lastEntry.Total_hours = total_hours;

        await this.punchingRepository.update(
          { entry_id: lastEntry.entry_id },
          lastEntry,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  //GET RECENT CLOCK IN'S
  async getRecentClock(emp_id: string) {
    try {
      const pastDayData = await this.punchingRepository.getRecentClocks(emp_id);
      return {
        message: 'Recent ClockIns',
        data: {
          RecentClockIns: pastDayData,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //CHECK CLOCK STATUS
  async getClockStatus(emp_id: string) {
    try {
      const today = new Date();

      const TodayDate = await moment(today, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const PunchStatus = await this.punchingRepository.findPuncStatus(
        emp_id,
        TodayDate,
      );

      const punchStatusData = PunchStatus[0];

      if (PunchStatus.length.toString() === CLOCK.NOT_MARKED) {
        return {
          message: `Please mark Your Attendance for ${TodayDate}`,
          data: {
            punchStatusEntry: '0',
          },
        };
      }

      if (punchStatusData.Entry_Status === CLOCK.IN) {
        return {
          message: 'You Have Already Clocked In',
          data: {
            punchStatusEntry: punchStatusData.Entry_Status,
          },
        };
      }

      if (punchStatusData.Entry_Status === CLOCK.OUT) {
        return {
          message: 'You Have Clocked Out For The Day!',
          data: {
            punchStatusEntry: punchStatusData.Entry_Status,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  //GET BETWEEN DATES
  async getBetweenDates(emp_id, start_date, present_date) {
    try {
      const StartDate = start_date;
      if (!start_date) {
        return {
          message: 'Start Date is required',
        };
      }
      const Present_date = present_date || new Date().toISOString();
      const PresentDateFormatted = await moment(Present_date).format(
        'YYYY-MM-DD',
      );

      console.log('present DAte', Present_date);

      const getData = await this.punchingRepository.getBetweenDates(
        emp_id,
        StartDate,
        PresentDateFormatted,
      );

      const count = getData.length;

      return {
        message: 'Dates Fetched Successfully',
        data: {
          count: count,
          getData,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDates(emp_id: string) {
    try {
      console.log('@@@@@@');

      const dates = await this.punchingRepository.getDistinctDates(
        emp_id,
        LIMIT_VALUE.MONTH,
      );
      return {
        message: 'Punching Records',
        data: dates,
      };
    } catch (error) {
      throw error;
    }
  }
}
