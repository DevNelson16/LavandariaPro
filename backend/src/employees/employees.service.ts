import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

import { hash } from 'bcryptjs';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  // LISTAR FUNCIONÁRIOS
  async findAll() {
    return this.prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // PROCURAR FUNCIONÁRIO POR ID
  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return employee;
  }

  // REGISTAR FUNCIONÁRIO
  async create(data: CreateEmployeeDto) {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmployee) {
      throw new ConflictException(
        'Já existe um funcionário com este email.',
      );
    }

    const hashedPassword = await hash(data.password, 10);

    const createData: Prisma.EmployeeCreateInput = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    };

    if (data.role !== undefined) {
      createData.role = data.role;
    }

    return this.prisma.employee.create({
      data: createData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }

  // ATUALIZAR FUNCIONÁRIO
  async update(id: number, data: UpdateEmployeeDto) {
    await this.findOne(id);

    if (data.email) {
      const existingEmployee = await this.prisma.employee.findFirst({
        where: {
          email: data.email,
          id: { not: id },
        },
      });

      if (existingEmployee) {
        throw new ConflictException(
          'Este email já pertence a outro funcionário.',
        );
      }
    }

    const updateData: Prisma.EmployeeUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    if (data.password !== undefined) {
      updateData.password = await hash(data.password, 10);
    }

    return this.prisma.employee.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }

  // ATIVAR OU DESATIVAR FUNCIONÁRIO
  async setActive(id: number, active: boolean) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }
}