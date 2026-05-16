import { Global, Module } from '@nestjs/common';

import { RequestContextService } from './request-context.service';

@Global()
@Module({
  exports: [RequestContextService],
  providers: [RequestContextService],
})
export class RequestContextModule {}
