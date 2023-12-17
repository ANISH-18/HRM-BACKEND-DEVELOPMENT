import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsUrl,
  IsArray,
  IsString,
  Length,
  Matches,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Role } from '@helpers';

const allowedMaritalStatuses = ['single', 'married', 'divorced', 'widow'];

// const allowedEmployeeRole = ['HR', 'ADMIN', 'SUPER_ADMIN', 'EMP'];

export class SignUpUserDto {
  @IsNotEmpty({ message: 'First Name Is Required' })
  @Length(3, 10, {
    message: 'First Name Should be between 3 and 10 characters',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Middle Name Is Required' })
  @Length(3, 10, {
    message: 'Middle Name Should be between 3 and 10 characters',
  })
  middlename: string;

  @IsNotEmpty({ message: 'Last Name Is Required' })
  @Length(3, 10, {
    message: 'Last Name This Should be between 3 and 10 characters',
  })
  lastName: string;

  @IsNotEmpty({ message: 'Email Is Required' })
  @IsEmail({}, { message: 'EMail must be valid email address' })
  officialEmail: string;

  @IsNotEmpty({ message: 'Employee role is required' })
  // @IsIn(allowedEmployeeRole, {
  //   message: 'Employee Status should be one of the following',
  // })
  @IsIn(Object.values(Role), {
    message: 'Employee Role  should be one of the following',
  })
  emp_role: string;

  @IsNotEmpty({message: 'Employee Position is Required'})
  emp_position: string;

  @IsNotEmpty({ message: 'Email Is Required' })
  @IsEmail({}, { message: 'EMail must be valid email address' })
  personalEmail: string;

  @IsNotEmpty({ message: 'Username is requried' })
  @Length(5, 20, {
    message: 'Last Name user Should be between 5 and 20 characters',
  })
  userName: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(7, 14, {
    message: 'Password must be between 6 to 14 characters',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and minimum length must be 8 character',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'skypeId is requried' })
  @Length(3, 20, {
    message: 'SkyeId Should be valid ',
  })
  skypeId: string;

  @IsNotEmpty({ message: 'Country Code is requried' })
  @Matches(/^[+]\d{1,3}$/, {
    message: 'Country Code must start with a "+" followed by 1 to 3 digits',
  })
  country_code: string;

  @IsNotEmpty({ message: 'Primary Phone number is requried' })
  @Matches(/^\d{10}$/, {
    message: 'Primary Phone number must be exactly 10 digits',
  })
  phone_1: string;

  @IsNotEmpty({ message: 'Secondary Phone  is requried' })
  @Matches(/^\d{10}$/, {
    message: 'Secondary Phone number must be exactly 10 digits',
  })
  phone_2: string;

  @IsNotEmpty({ message: 'Maritual Status is required' })
  @IsIn(allowedMaritalStatuses, {
    message: 'Maritual Status should be one of the following',
  })
  maritualStatus: string;

  @IsNotEmpty({ message: 'DOB is required' })
  // @IsDate({ message: 'Invalid Date' })
  DOB: Date;

  @IsNotEmpty({ message: 'DOJ is required' })
  // @IsDate({ message: 'Invalid Date' })
  DOJ: Date;

  @IsNotEmpty({ message: 'Permanent Address is required' })
  @Length(5, 100, {
    message: 'Permanent Address should be between 5 and 100 characters',
  })
  permanentAddress: string;

  @IsNotEmpty({ message: 'temp_address  is required' })
  @Length(5, 100, {
    message: 'Temporary Address should be between 5 and 100 characters',
  })
  temp_address: string;

  @IsNotEmpty({ message: 'City is required' })
  @Length(2, 50, { message: 'City should be between 2 and 50 characters' })
  city: string;

  @IsNotEmpty({ message: 'State is required' })
  @Length(2, 50, { message: 'State should be between 2 and 50 characters' })
  state: string;

  @IsNotEmpty({ message: 'Country is required' })
  @Length(2, 50, { message: 'Country should be between 2 and 50 characters' })
  country: string;

  @IsNotEmpty({ message: 'Postal Code is required' })
  @Matches(/^[0-9]{6}$/, {
    message: 'Postal Code must be a 6-digit number',
  })
  postalCode: string;

  @IsNotEmpty({ message: 'Documents are required' })
  @IsArray({ message: 'Documents must be an array' })
  @IsString({ each: true, message: 'Each document must be a string' })
  documents: string[];

  @IsNotEmpty({ message: 'LinkedIn URL is required' })
  @IsUrl({}, { message: 'Invalid LinkedIn URL' })
  linkedInUrl: string;

  @IsOptional()
  @IsString({ message: 'Profile picture is required' })
  profilePic: string;
}
