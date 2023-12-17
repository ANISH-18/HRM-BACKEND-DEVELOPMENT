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

import { Transform } from 'class-transformer';

const clientType = ['Bussiness', 'Individual'];

export class createClientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @Length(3, 15, {
    message: 'First name should be between 3 and 15 characters',
  })
  client_first_name: string;

  @IsNotEmpty({ message: 'last name is required' })
  @Length(3, 15, {
    message: 'last name should be between 3 and 15 characters',
  })
  client_last_name: string;

  @IsNotEmpty({ message: 'Company name is required' })
  @Length(3, 15, {
    message: 'Company name should be between 3 and 15 characters',
  })
  company_name: string;

  @IsNotEmpty({ message: 'Company url is required' })
  @IsUrl({}, { message: 'Invalid  URL' })
  company_website_link: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'EMail must be valid email address' })
  @Transform(({ value }) => value.toLowerCase())
  clientEmail: string;

  @IsNotEmpty({ message: 'Primary Phone number is requried' })
  @Matches(/^\d{10}$/, {
    message: 'Primary Phone number must be exactly 10 digits',
  })
  client_phone_1: string;

  @IsNotEmpty({ message: 'Secondary Phone  is requried' })
  @Matches(/^\d{10}$/, {
    message: 'Secondary Phone number must be exactly 10 digits',
  })
  client_phone_2: string;

  @IsNotEmpty({ message: 'GST Number is required' })
  @Matches(/^\d{15}$/, {
    message: 'Gst number  must be exactly 15 digits',
  })
  client_gst: string;

  @IsNotEmpty({ message: 'Pan Number is required' })
  @Matches(/^\d{10}$/, {
    message: 'Pan number must be exactly 10 digits',
  })
  client_pan: string;

  @IsNotEmpty({ message: 'Client Address is required' })
  @Length(5, 100, {
    message: 'Client Address should be between 5 and 100 characters',
  })
  client_address: string;

  @IsNotEmpty({ message: 'City is required' })
  @Length(2, 50, { message: 'City should be between 2 and 50 characters' })
  client_city: string;

  @IsNotEmpty({ message: 'State is required' })
  @Length(2, 50, { message: 'State should be between 2 and 50 characters' })
  client_state: string;

  @IsNotEmpty({ message: 'Country is required' })
  @Length(2, 50, { message: 'Country should be between 2 and 50 characters' })
  client_country: string;

  @IsNotEmpty({ message: 'Postal Code is required' })
  @Matches(/^[0-9]{6}$/, {
    message: 'Postal Code must be a 6-digit number',
  })
  client_zip: string;

  @IsNotEmpty({ message: 'Client Preferred Language is required' })
  @Length(3, 10, {
    message: 'Language should be between 3 and 10 characters',
  })
  client_language: string;

  @IsNotEmpty({ message: 'Client Currency is required' })
  @Length(1, 10, {
    message: 'Currency should be of valid characters',
  })
  client_currency: string;

  @IsNotEmpty({ message: 'Client Reference is required' })
  @Length(3, 10, {
    message: 'Reference should be between 3 to 10 character',
  })
  client_reference: string;

  @IsNotEmpty({ message: 'Payment Method is required' })
  @IsIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'], {
    message: 'Invalid Payment Method',
  })
  payment_method: string;

  @IsNotEmpty({ message: 'Client Coordinator First Name is required' })
  @Length(3, 15, {
    message:
      'Client Coordinator First Name should be between 3 and 15 characters',
  })
  client_coordinator_first_name: string;

  @IsNotEmpty({ message: 'Client Coordinator Last Name is required' })
  @Length(3, 15, {
    message:
      'Client Coordinator Last Name should be between 3 and 15 characters',
  })
  client_coordinator_last_name: string;

  @IsNotEmpty({ message: 'Client Coordinator Email is required' })
  @IsEmail(
    {},
    { message: 'Client Coordinator Email must be a valid email address' },
  )
  @Transform(({ value }) => value.toLowerCase())
  client_coordinator_email: string;

  @IsNotEmpty({ message: 'Client Coordinator Phone is required' })
  @Matches(/^\d{10}$/, {
    message: 'Client Coordinator Phone must be exactly 10 digits',
  })
  client_coordinator_phone: string;

  @IsNotEmpty({ message: 'Accountant First Name is required' })
  @Length(3, 15, {
    message: 'Accountant First Name should be between 3 and 15 characters',
  })
  accountant_first_name: string;

  @IsNotEmpty({ message: 'Accountant Last Name is required' })
  @Length(3, 15, {
    message: 'Accountant Last Name should be between 3 and 15 characters',
  })
  accountant_last_name: string;

  @IsNotEmpty({ message: 'Accountant Email is required' })
  @IsEmail({}, { message: 'Accountant Email must be a valid email address' })
  @Transform(({ value }) => value.toLowerCase())
  accountant_email: string;

  @IsNotEmpty({ message: 'Accountant Phone is required' })
  @Matches(/^\d{10}$/, {
    message: 'Accountant Phone must be exactly 10 digits',
  })
  accountant_phone: string;
}
