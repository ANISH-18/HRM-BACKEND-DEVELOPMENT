import { PartialType } from '@nestjs/mapped-types';
import { ProjectDto } from './create-project.dto';

export class updateProjectDto extends PartialType(ProjectDto) {}
