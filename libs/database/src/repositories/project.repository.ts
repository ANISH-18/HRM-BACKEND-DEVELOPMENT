import { ProjectEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {
    super(
      projectRepository.target,
      projectRepository.manager,
      projectRepository.queryRunner,
    );
  }

  async findByProject(project_name: string) {
    return await this.projectRepository.findOneBy({ project_name });
  }
}
