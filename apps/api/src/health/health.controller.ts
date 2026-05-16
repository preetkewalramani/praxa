import { Controller, Get } from '@nestjs/common';
import { API_VERSION } from '@praxa/constants';

interface HealthResponse {
  status: 'ok';
}

@Controller({ path: 'health', version: API_VERSION })
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return { status: 'ok' };
  }
}
