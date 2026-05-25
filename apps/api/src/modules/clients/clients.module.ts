import { Module } from '@nestjs/common';
import { ClientsController } from './controllers/clients.controller';
import { ClientRepository } from './repositories/client.repository';
import { ClientTagRepository } from './repositories/client-tag.repository';
import { ClientsService } from './services/clients.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientRepository, ClientTagRepository, ClientsService],
})
export class ClientsModule {}
