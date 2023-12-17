import { EmployeeEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class EmployeeRepository extends Repository<EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    private EmployeeRepository: Repository<EmployeeEntity>,
  ) {
    super(
      EmployeeRepository.target,
      EmployeeRepository.manager,
      EmployeeRepository.queryRunner,
    );
  }

  async findByEmail(officialEmail: string): Promise<EmployeeEntity> {
    return await this.EmployeeRepository.findOneBy({ officialEmail });
  }

  async findById(id: string): Promise<EmployeeEntity> {
    return await this.EmployeeRepository.findOneBy({ id });
  }
}
