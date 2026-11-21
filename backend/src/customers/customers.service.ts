import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service.js'
import { CreateCustomerDto } from './dto/create-customer.dto.js'
import { UpdateCustomerDto } from './dto/update-customer.dto.js'

@Injectable()
export class CustomersService {
  constructor (private readonly prisma: PrismaService) {}

  // LISTAR TODOS OS CLIENTES
  async findAll () {
    return this.prisma.customer.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // PROCURAR CLIENTE POR ID
  async findOne (id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    })

    if (!customer || !customer.active) {
  throw new NotFoundException('Cliente não encontrado.')
}

    return customer
  }

  // CRIAR CLIENTE
  async create (data: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    })

    if (existingCustomer) {
      throw new ConflictException(
        'Já existe um cliente com este telefone ou email.',
      )
    }

    return this.prisma.customer.create({
      data,
    })
  }

  // ATUALIZAR CLIENTE
  async update (id: number, data: UpdateCustomerDto) {
    await this.findOne(id)

    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(data.phone ? [{ phone: data.phone }] : []),
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    })

    if (existingCustomer) {
      throw new ConflictException(
        'O telefone ou email já pertence a outro cliente.',
      )
    }

    return this.prisma.customer.update({
      where: { id },
      data,
    })
  }

  // ELIMINAR CLIENTE
  async remove (id: number) {
    await this.findOne(id)

    return this.prisma.customer.update({
      where: { id },
      data: {
        active: false,
      },
    })
  }
}
