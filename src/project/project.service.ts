import { ProjectRepository } from 'libs/database/src';
import { ProjectDto } from './dto/create-project.dto';
import { Response } from 'express';
import { updateProjectDto } from './dto/update-project.dto';



import {
  ConflictException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(createInput: ProjectDto) {
    try {
      // hello 
      console.log("@@@@@@@@@@@@@");
      
      const projectInfo = await this.projectRepository.findByProject(
        createInput.project_name,
      );
      if (projectInfo) {
        throw new ConflictException('Project Already Exists');
      }

      let projectObj = await this.projectRepository.create(createInput);
      projectObj = await this.projectRepository.save(projectObj);

      return {
        message: 'Project Registered Successfully',
        data: projectObj,
      };
    
    } catch (error) {
      throw error;
    }
  }

  async getAllProject() {
    try {
      const project = await this.projectRepository.find();
      if (!project) {
        throw new BadRequestException('No project Found');
      }

      return {
        message: 'project Details Fetched',
        data: project,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async getProject(project_id: string ) {
    try {
      const getProject = await this.projectRepository.findOneBy({ project_id });
      if (!getProject) {
        throw new BadRequestException('project Not Found');
      }

      return {
        message: 'project fetched Fetched',
        data: getProject,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProject(project_id: string, update: updateProjectDto ) {
    try {
      const projectExist = await this.projectRepository.findOne({
        where: { project_id },
      });

      if (!projectExist) {
        throw new BadRequestException('Project not found');
      }

      await this.projectRepository.update({ project_id }, update);

      const updatedProject = await this.projectRepository.findOne({
        where: { project_id },
      });

      return {
        message: 'project Updated Fetched',
        data: updatedProject,
      };

      
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(project_id: string) {
    try {
      const deleteObj = await this.projectRepository.findOne({
        where: { project_id },
      });
      if (!deleteObj) {
        throw new BadRequestException('Project not found');
      }

      deleteObj.deletedAt = new Date();

      const projectDelete = await this.projectRepository.save(deleteObj);
    
     return {
      message: 'project Deleted Fetched',
      data: deleteObj,
    };
    } catch (error) {
      throw error;
    }
  }
}
