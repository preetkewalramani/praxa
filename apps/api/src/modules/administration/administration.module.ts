import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdministrationController } from './controllers/administration.controller';
import { AdministrationRepository } from './repositories/administration.repository';
import { AdministrationService } from './services/administration.service';

@Module({
  imports: [AuthModule],
  controllers: [AdministrationController],
  providers: [AdministrationRepository, AdministrationService],
})
export class AdministrationModule {}
