import { IsDate, IsNotEmpty, IsString, Length } from 'class-validator';

export class ProjectDto {

  
  @IsNotEmpty({ message: 'Project Name Is Required' })
  @Length(3, 20, {
    message: 'Project Name Should be between 3 and 20 characters',
  })
  project_name: string;

  @IsNotEmpty({ message: 'Description Name Is Required' })
  @Length(3, 50, {
    message: 'Description Should be between 3 and 50 characters',
  })
  description: string;

  @IsNotEmpty({ message: 'Project Manager  Is Required' })
  @Length(3, 20, {
    message: 'Project Manager Should be between 3 and 20 characters',
  })
  project_Manager: string;

  @IsNotEmpty({ message: 'Client id is requried' })
  client_id: string;

  @IsNotEmpty({ message: 'Project Start Date is required' })
  //@IsDate({ message: 'Invalid Date' })
  start_date: Date;

  @IsNotEmpty({ message: 'Project End Date is required' })
  // @IsDate({ message: 'Invalid Date' })
  end_date: Date;
}
