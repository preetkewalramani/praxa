import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { type CurrentAuthUser } from '../interfaces/current-auth-user.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): CurrentAuthUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: CurrentAuthUser }>();
    return request.user;
  },
);
