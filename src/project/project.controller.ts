import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { updateProjectDto } from './dto/update-project.dto';
import { AccessTokenGuard } from '@jwt_auth';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // hello
  @UseGuards(AccessTokenGuard)
  @Post('')
  createProject(@Body() createInput: ProjectDto ) {
    return this.projectService.createProject(createInput );
  }

  @UseGuards(AccessTokenGuard)
  @Get('')
  getAllProject() {
    return this.projectService.getAllProject();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getProject(@Query('project_id') project_id: string) {
    return this.projectService.getProject(project_id );
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  updateProject(
    @Query('project_id') project_id: string,
    @Body() update: updateProjectDto,
   
  ) {
    return this.projectService.updateProject(project_id, update );
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':project_id')
  deleteProject(@Query('project_id') project_id: string ) {
    return this.projectService.deleteProject(project_id );
  }
}
