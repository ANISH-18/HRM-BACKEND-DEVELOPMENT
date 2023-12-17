import { IsNotEmpty, IsIn } from 'class-validator';

const allowedStatus = ['1', '2', '3'];

export class CreateTimeSheetDto {
  // @IsNotEmpty({ message: ' Employee ID is required' })

  @IsNotEmpty({ message: 'Start Time is Required' })
  start_time: Date;

  @IsNotEmpty({ message: 'Finish Time is Required' })
  end_time: Date;

  Emp_id: string;

  total_time: string;

  t_Date: string;

  // todo: {
  //       ToDo_Id: string;
  // };
  ToDo_Id: string;
}
