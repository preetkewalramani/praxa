import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  type HealthCheckResult,
  type HealthIndicatorResult,
} from '@nestjs/terminus';
import { API_VERSION } from '@praxa/constants';

import { Public } from '../../common/decorators';

@ApiTags('health')
@Controller({ path: 'health', version: API_VERSION })
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiOkResponse({
    description: 'Health status wrapped by the global response interceptor.',
    schema: {
      example: {
        success: true,
        data: {
          status: 'ok',
          info: { app: { status: 'up' } },
          error: {},
          details: { app: { status: 'up' } },
        },
        meta: { correlationId: '018f7b88-9b56-78b5-a7ef-63f2db7f7c12' },
        timestamp: '2026-05-16T00:00:00.000Z',
      },
    },
  })
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.checkApplication(),
      () => this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.checkRedisPlaceholder(),
      () => this.checkDatabasePlaceholder(),
    ]);
  }

  private checkApplication(): Promise<HealthIndicatorResult> {
    return Promise.resolve({
      app: {
        status: 'up',
      },
    });
  }

  private checkRedisPlaceholder(): Promise<HealthIndicatorResult> {
    return Promise.resolve({
      redis: {
        status: 'up',
      },
    });
  }

  private checkDatabasePlaceholder(): Promise<HealthIndicatorResult> {
    return Promise.resolve({
      database: {
        status: 'up',
      },
    });
  }
}
