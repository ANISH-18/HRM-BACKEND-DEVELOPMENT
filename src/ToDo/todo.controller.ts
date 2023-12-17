import {
  Body,
  Query,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Patch,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { NewToDoService } from './todo.service';
import { updateToDoDto } from './dto/update-todo.dto';
import { ToDoDto } from './dto/create-todo.dto';
import { AccessTokenGuard, GetCurrentUserId } from '@jwt_auth';
import { formatHandlers, taskFormat } from '@helpers';

@Controller('NewToDo')
export class NewToDoController {
  constructor(private readonly toDoService: NewToDoService) {}

  //CREATE TODO
  @UseGuards(AccessTokenGuard)
  @Post('create')
  createToDo(@Body() createInput: ToDoDto, @GetCurrentUserId() emp_id: string) {
    // console.log(emp_id);

    return this.toDoService.createToDo(createInput, emp_id);
  }

  //UPDATE TODO WITH TODO_ID
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  updateToDo(@Query('todo_id') id: string, @Body() update: updateToDoDto) {
    return this.toDoService.updateToDo(id, update);
  }

  //UPDATE TODO STATUS WITH TODO_ID
  @UseGuards(AccessTokenGuard)
  @Get('updateStatus')
  updateTodoStatus(
    @Query('ToDo_id') ToDo_id: string,
    @GetCurrentUserId() emp_id: string,
  ) {
    return this.toDoService.updateTodoStatus(ToDo_id);
  }

  //DELETE TODO
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  deleteToDo(@Query('todo_id') id: string) {
    return this.toDoService.deleteToDo(id);
  }

  //Working DONE
  //Get TODO STATUS BY CATEGORY TODAY || YESTERDAY || WEEK || MONTH
  @UseGuards(AccessTokenGuard)
  @Get('taskList')
  async getTaskList(
    @Query('format') format: string,
    @GetCurrentUserId() emp_id: string,
  ) {
    // return await this.toDoService.getTaskListByStatus(emp_id);
    const handler = formatHandlers[format];
    if (handler && this.toDoService[handler]) {
      return await this.toDoService[handler](emp_id);
    } else {
      throw new NotFoundException('Format is not Defined or Incorrect');
    }
  }

  //GET YESTERDAY || WEEK || MONTH || ALL-TIME
  @UseGuards(AccessTokenGuard)
  @Get('getTimesheet')
  async getTimesheet(
    @Query('format') format: string,
    @GetCurrentUserId() emp_id: string,
  ) {
    return this.toDoService.getTimesheetsByFormat(format, emp_id);
  }

  //TASKLIST BY DATE
  @UseGuards(AccessTokenGuard)
  @Get('taskListByDate')
  getToDoByDate(
    @GetCurrentUserId() emp_id: string,
    @Query('todo_date') todo_date: string,
  ) {
    console.log(todo_date);
    return this.toDoService.getToDoByDate(emp_id, todo_date);
    // return this.toDoService.getTodoByDate1(emp_id, todo_date);
  }

  //GET BETWEEN TIMESHEET
  @UseGuards(AccessTokenGuard)
  @Get('getBetween')
  async getBetween(
    @GetCurrentUserId() emp_id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.toDoService.getBetween(emp_id, startDate, endDate);
  }

  //GET TIMESHEET BY TODO
  @UseGuards(AccessTokenGuard)
  @Get('getByToDo')
  async getTimesheetByToDo(@Query('todo_id') todo_id: string) {
    return this.toDoService.getTimesheetByTask(todo_id);
  }
}
