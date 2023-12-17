import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateTimeSheetDto } from './dto/create-timesheet.dto';
import { TimesheetService } from './timesheet.service';
import {
  AccessTokenGuard,
  GetCurrentUserId,
  hasRoles,
  RolesGuard,
} from '@jwt_auth';
import { Role } from '@helpers';
import { todo } from 'node:test';

@Controller('timesheet')
export class TimeSheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  //Create Timesheet
  @UseGuards(AccessTokenGuard)
  @Post('addTimesheet')
  createSheet(
    @Query('todo_id') todo_id: string,
    @Body() input: CreateTimeSheetDto,
    @GetCurrentUserId() Emp_id: string,
  ) {
    return this.timesheetService.createTimesheet(todo_id, input, Emp_id);
  }

  //Update Timesheet
  @UseGuards(AccessTokenGuard)
  @Put('updateTimesheet')
  updateTimesheet(
    @Query('timesheet_id') timesheet_id: string,
    @Body() input: CreateTimeSheetDto,
  ) {
    return this.timesheetService.updateTimesheet(timesheet_id, input);
  }

  //DELETE TIMESHEET
  @UseGuards(AccessTokenGuard)
  @Patch('deleteTimesheet')
  deleteToDo(@Query('timesheet_id') id: string) {
    return this.timesheetService.deleteTimesheet(id);
  }

  //GET TIMESHEET BY DATE
  @UseGuards(AccessTokenGuard)
  @Get('getTimesheet')
  getTimesheet(
    @Query('date') date: string,
    @GetCurrentUserId() emp_id: string,
  ) {
    return this.timesheetService.getTimesheet(date, emp_id);
  }
}
