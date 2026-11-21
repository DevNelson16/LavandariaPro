import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number }) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!employee || !employee.active) {
      throw new UnauthorizedException(
        'Funcionário não encontrado ou inativo.',
      );
    }

    return {
      id: employee.id,
      email: employee.email,
      role: employee.role,
    };
  }
}