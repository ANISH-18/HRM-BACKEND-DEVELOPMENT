import { PartialType } from '@nestjs/mapped-types';
import { createClientDto } from './create-client.dto';

export class updateClientDto extends PartialType(createClientDto) {}
