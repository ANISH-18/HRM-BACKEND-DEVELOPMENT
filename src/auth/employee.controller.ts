import {
  Body,
  Query,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { updateEmployeeDto } from './dto/update-employee.dto';
import { AccessTokenGuard } from '@jwt_auth';


@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  
  updateEmployee(@Query('id') id: string, @Body() update: updateEmployeeDto) {
    return this.employeeService.updateEmployee(id, update);
  }

  @UseGuards(AccessTokenGuard)
  @Get('getEmp')  
  getAllEmployee() {
    return this.employeeService.getAllEmployee();
  }

  @UseGuards(AccessTokenGuard)
  @Get('getEmp/:id')
  getEmployee(@Query('id') id: string) {
    return this.employeeService.getEmployee(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  deleteEmployee(@Query('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
