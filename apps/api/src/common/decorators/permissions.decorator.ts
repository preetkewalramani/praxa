import { SetMetadata } from '@nestjs/common';

import { PERMISSIONS_METADATA } from './auth.metadata';

export const Permissions = (...permissions: string[]): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMISSIONS_METADATA, permissions);
