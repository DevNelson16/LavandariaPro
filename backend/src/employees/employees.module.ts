import { Module } from '@nestjs/common';

import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';


@Module({
  imports: [PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}