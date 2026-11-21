import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  // LISTAR SERVIÇOS
  async findAll() {
    return this.prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // CONSULTAR SERVIÇO POR ID
  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return service;
  }

  // CRIAR SERVIÇO
  async create(data: CreateServiceDto) {
    const existingService = await this.prisma.service.findUnique({
      where: { name: data.name },
    });

    if (existingService) {
      throw new ConflictException(
        'Já existe um serviço com este nome.',
      );
    }

    return this.prisma.service.create({
      data,
    });
  }

  // ATUALIZAR SERVIÇO
  async update(id: number, data: UpdateServiceDto) {
    await this.findOne(id);

    if (data.name) {
      const existingService = await this.prisma.service.findFirst({
        where: {
          name: data.name,
          id: { not: id },
        },
      });

      if (existingService) {
        throw new ConflictException(
          'Já existe outro serviço com este nome.',
        );
      }
    }

    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  // ATIVAR OU DESATIVAR SERVIÇO
  async setActive(id: number, active: boolean) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: { active },
    });
  }
}