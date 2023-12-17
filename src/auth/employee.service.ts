import { EmployeeRepository } from '@database/repositories/employee.repository';
import {
  BadRequestException,
  Injectable,
  } from '@nestjs/common';
import { updateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    
  ) {}

  async updateEmployee(id: string, update: updateEmployeeDto) {
    try {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { id },
      });
      if (!existingEmployee) {
        throw new BadRequestException('Employee not found');
      }

      await this.employeeRepository.update({ id }, update);

      const updatedEmployee = await this.employeeRepository.findOne({
        where: { id },
      });
      return {
        message: 'Employee Updated Succesfully',
        data: updatedEmployee,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllEmployee() {
    try {
      const employee = await this.employeeRepository.find();
      if (!employee) {
        throw new BadRequestException('No Employee Found');
      }

      return {
        message: 'Employee Details Fetched',
        data: employee,
      };
    } catch (error) {
      throw error;
    }
  }

  async getEmployee(id: string) {
    try {
      const employee = await this.employeeRepository.findOneBy({ id });
      if (!employee) {
        throw new BadRequestException('Employee Not Found');
      }

      return {
        message: 'Employee fetched Succesfully',
        data: employee,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteEmployee(id: string) {
    try {
      const deleteEmp = await this.employeeRepository.findOne({
        where: { id },
      });
      if (!deleteEmp) {
        throw new BadRequestException('Employee not found');
      }

      deleteEmp.deletedAt = new Date();

      const deleteEmployee = await this.employeeRepository.save(deleteEmp);
      return {
        message: 'Employee Deleted Succesfully',
        data: deleteEmployee,
      };
    } catch (error) {
      throw error;
    }
  }
}
