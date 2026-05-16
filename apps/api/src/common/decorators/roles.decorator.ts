import { SetMetadata } from '@nestjs/common';

import { ROLES_METADATA } from './auth.metadata';

export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_METADATA, roles);
