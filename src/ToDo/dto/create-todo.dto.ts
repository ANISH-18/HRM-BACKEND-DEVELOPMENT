// create-task.dto.ts
import {
  IsNotEmpty,
  IsIn,
} from 'class-validator';

const allowedStatuses = ['1', '2', '3'];

export class ToDoDto {
  
  ToDo_Id:string;
  Emp_id:string;

  ToDo_Date: string;

  @IsNotEmpty({ message: 'Task is required' })
  Task: string;
 
  @IsNotEmpty({ message: 'Project Id is required' })
  project_id: string;

  Task_Status:string

 

}

// update-task.dto.ts
