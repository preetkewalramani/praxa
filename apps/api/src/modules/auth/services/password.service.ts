import { timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AUTH_BCRYPT_ROUNDS } from '../constants/auth.constants';

@Injectable()
export class PasswordService {
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, AUTH_BCRYPT_ROUNDS);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(value, hash);
    const a = Buffer.from(match ? '1' : '0');
    const b = Buffer.from('1');

    return timingSafeEqual(a, b);
  }
}
