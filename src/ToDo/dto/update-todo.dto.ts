import { PartialType } from '@nestjs/mapped-types';
import { ToDoDto } from './create-todo.dto';

export class updateToDoDto extends PartialType(ToDoDto) {}
