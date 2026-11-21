import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
) {}

  async validateEmployee(loginDto: LoginDto) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!employee || !employee.active) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      employee.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };
  }

  async login(loginDto: LoginDto) {
  const employee = await this.validateEmployee(loginDto);

  const payload = {
    sub: employee.id,
    email: employee.email,
    role: employee.role,
  };

  return {
    access_token: await this.jwtService.signAsync(payload),
    employee,
  };
}
}