import { ClientRepository } from '@database';
import {
  ConflictException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { createClientDto } from './dto/create-client.dto';
import { updateClientDto } from './dto/update-client.dto';
import { STATUS_CODES } from 'http';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(client: createClientDto) {
    try {
      const clientInfo = await this.clientRepository.findByCompany(client.company_name ) ;
      if (clientInfo) {
        throw new ConflictException('Company  Already Exists');
      }

      const clientEmail = await this.clientRepository.findByEmail(
        client.clientEmail,
      );
      if (clientEmail) {
        throw new ConflictException('Client Email  Already Exists');
      }

      const phoneNumber = await this.clientRepository.findByPhone_1(
        client.client_phone_1,
      );
      if (phoneNumber) {
        throw new ConflictException('Primary Number Already Exists');
      }

      const phoneNumber2 = await this.clientRepository.findByPhone_2(
        client.client_phone_2,
      );
      if (phoneNumber2) {
        throw new ConflictException('Secondary number Already Exists');
      }

      const clientGst = await this.clientRepository.findByGst(
        client.client_gst,
      );
      if (clientGst) {
        throw new ConflictException('Gst Number Already Exists');
      }

      const clientPan = await this.clientRepository.findByPan(
        client.client_pan,
      );
      if (clientPan) {
        throw new ConflictException('Pan Already Exists');
      }

      const co_ordinator_email = await this.clientRepository.findByEmail(
        client.client_coordinator_email,
      );
      if (co_ordinator_email) {
        throw new ConflictException('Co-Ordinator Email Already Exists');
      }

      const co_ordinator_phone = await this.clientRepository.findByCo_num(
        client.client_coordinator_phone,
      );
      if (co_ordinator_phone) {
        throw new ConflictException('Co-Ordinator Phone Already Exists');
      }

      const accountanEmail = await this.clientRepository.findByAccEmail(
        client.accountant_email,
      );
      if (accountanEmail) {
        throw new ConflictException('Accountant Email Already Exists');
      }

      const accountant_phone = await this.clientRepository.findAccPhone(
        client.accountant_phone,
      );
      if (accountant_phone) {
        throw new ConflictException('Accountant Phone Already Exists');
      }

      let clientObj = await this.clientRepository.create(client);
      clientObj = await this.clientRepository.save(clientObj);

      return {
        message: 'Client Registered Successfully',
        data: clientObj,
      };
    } catch (err) {
      throw err;
    }
  }

  async getAllClient() {
    try {
      const Clients = await this.clientRepository.find();

      if (!Clients) {
        throw new BadRequestException('No Clients Found');
      }

      return {
        message: 'Client Details Fetched',
        data: Clients,
      };
    } catch (err) {
      throw err;
    }
  }

  async getClient(client_id: string) {
    try {
      // const client = await this.clientRepository.findById(client_id);
      const client = await this.clientRepository.findOneBy({ client_id });

      if (!client) {
        throw new BadRequestException('Client Not Found');
      }

      return {
        message: 'Client fetched Succesfully',
        data: client,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateClient(client_id: string, update: updateClientDto) {
    try {
      // console.log(update, '@@@@@@@@@@2');
      console.log('Client ID:', client_id);

      const existingClient = await this.clientRepository.findOne({
        where: { client_id },
      });

      if (!existingClient) {
        throw new BadRequestException('Client not found');
      }

      // const updatedClient = await this.clientRepository.save({
      //   ...existingClient,
      //   ...update,
      // });

      await this.clientRepository.update({ client_id }, update);

      const updatedClient = await this.clientRepository.findOne({
        where: { client_id },
      });

      return {
        message: 'Client Updated Succesfully',
        data: updatedClient,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteClient(client_id: string) {
    try {
      const deleteClientObj = await this.clientRepository.findOne({
        where: { client_id },
      });
      if (!deleteClientObj) {
        throw new BadRequestException('Client not found');
      }

      deleteClientObj.deletedAt = new Date();

      const clientDelete = await this.clientRepository.save(deleteClientObj);
      return {
        message: 'Client Deleted Succesfully',
        data: clientDelete,
      };
    } catch (error) {
      throw error;
    }
  }
}
