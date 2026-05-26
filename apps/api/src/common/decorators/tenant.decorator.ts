import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

interface RequestWithTenant {
  tenantId?: string;
}

export const Tenant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithTenant>();

    return request.tenantId;
  },
);
