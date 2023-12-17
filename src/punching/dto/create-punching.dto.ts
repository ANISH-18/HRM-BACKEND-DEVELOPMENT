import { IsNotEmpty, IsIn } from 'class-validator';
import { Timestamp } from 'typeorm';

const allowedEntryType = ['Office', 'Lunch', 'Tea', 'Personal'];

export class PunchingEntryDto {
  // @IsNotEmpty ({message:'Entry Date is Required'})
  entry_id: string;
  Entry_Date: string;

  // @IsNotEmpty({message:'Employee Id is Required'})
  Emp_id: string;

  // @IsISO8601()
  Punch_In: string;

  // @IsISO8601()
  Punch_Out: string;

  Entry_Status: string;

  @IsNotEmpty({ message: 'Entry Type is Required' })
  @IsIn(allowedEntryType, {
    message: ' Entry Type should be valid',
  })
  Entry_Type: string;

  Total_hours: string;
}
