import { AuthService } from './auth.service.js'
import { LoginDto } from './dto/login.dto.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { Roles } from './decorators/roles.decorator.js'
import { RolesGuard } from './roles.guard.js'

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common'
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login (@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getProfile (@Req() request: AuthenticatedRequest) {
    return request.user
  }
}
