import { ClientEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { createClientDto } from 'src/client/dto/create-client.dto';

export class ClientRepository extends Repository<ClientEntity> {
  constructor(
    @InjectRepository(ClientEntity)
    private ClientRepository: Repository<ClientEntity>,
  ) {
    super(
      ClientRepository.target,
      ClientRepository.manager,
      ClientRepository.queryRunner,
    );
  }
  
  async findByCompany(company_name: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ company_name });
  }

  async findByEmail(clientEmail: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ clientEmail });
  }

  async findByPhone_1(client_phone_1: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ client_phone_1 });
  }

  async findByPhone_2(client_phone_2: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ client_phone_2 });
  }

  async findByGst(client_gst: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ client_gst });
  }

  async findByPan(client_pan: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ client_pan });
  }

  async findByCO_Email(accountant_email: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ accountant_email });
  }

  async findByCo_num(client_coordinator_phone: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ client_coordinator_phone });
  }

  async findByAccEmail(accountant_email: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ accountant_email });
  }

  async findAccPhone(accountant_phone: string): Promise<ClientEntity> {
    return await this.ClientRepository.findOneBy({ accountant_phone });
  }

  // ###################################################

  async findById(client_id: string): Promise<ClientEntity> {
    return this.ClientRepository.findOneBy({ client_id });
  }

  async updateClient(client_id: string, update: object) {
    return this.ClientRepository.update(client_id, update);
  }

  // async findbyBoth(
  //   client_phone_1: string,
  //   client_phone_2: string,
  // ): Promise<ClientEntity[]> {
  //   return await this.ClientRepository.find({
  //     where: [
  //       { client_phone_1: client_phone_1 },
  //       { client_phone_2: client_phone_2 },
  //     ],
  //   });
  // }
}
