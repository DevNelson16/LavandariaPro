import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHome() {
    return {
      message: 'LavandariaPro API',
      status: 'Online',
      version: '1.0.0',
    };
  }

  @Get('customers')
  async getCustomers() {
    return this.prisma.customer.findMany();
  }
}