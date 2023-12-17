import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { createClientDto } from './dto/create-client.dto';
import { updateClientDto } from './dto/update-client.dto';
import { AccessTokenGuard } from '@jwt_auth';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AccessTokenGuard)
  @Post('')
  createClient(@Body() client: createClientDto) {
    // return 'route hit';
    return this.clientService.createClient(client);
  }

  @UseGuards(AccessTokenGuard)
  @Get('')
  getAllClient() {
    return this.clientService.getAllClient();
  }



  @UseGuards(AccessTokenGuard)
  @Get(':client_id')
  getClient(@Query('client_id') client_id: string) {
    console.log(client_id);

    return this.clientService.getClient(client_id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':client_id')
  updateClient(
    @Query('client_id') client_id: string,
    @Body() update: updateClientDto,
  ) {
    console.log(client_id, '$$$$$$$$$$$$');

    return this.clientService.updateClient(client_id, update);
  }


  @UseGuards(AccessTokenGuard)
  @Patch(':client_id')
  deleteClient(@Query('client_id') client_id: string) {
    return this.clientService.deleteClient(client_id);
  }
}
