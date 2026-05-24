import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { type LoginDto } from '../dto/login.dto';
import { type RefreshDto } from '../dto/refresh.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { type CurrentAuthUser } from '../interfaces/current-auth-user.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and issue access/refresh tokens' })
  login(
    @Body() input: LoginDto,
    @Ip() ip: string,
    @Req() request: { headers: Record<string, string> },
  ) {
    return this.authService.login(input, ip, request.headers['user-agent']);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() input: RefreshDto) {
    return this.authService.refresh(input);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@CurrentUser() user: CurrentAuthUser): Promise<{ success: true }> {
    await this.authService.logout(user.sessionId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: CurrentAuthUser): CurrentAuthUser {
    return user;
  }
}
