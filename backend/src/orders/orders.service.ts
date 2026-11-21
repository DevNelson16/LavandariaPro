import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { Prisma, OrderStatus } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service.js'
import { CreateOrderDto } from './dto/create-order.dto.js'
import { UpdateOrderDto } from './dto/update-order.dto.js'

@Injectable()
export class OrdersService {
  constructor (private readonly prisma: PrismaService) {}

  // LISTAR ENCOMENDAS
  async findAll () {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            service: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // CONSULTAR ENCOMENDA POR ID
  async findOne (id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            service: true,
          },
        },
        payment: true,
      },
    })

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.')
    }

    return order
  }

  // CRIAR ENCOMENDA
  async create (data: CreateOrderDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    })

    if (!customer || !customer.active) {
      throw new NotFoundException('Cliente não encontrado ou inativo.')
    }

    // VERIFICAR FUNCIONÁRIO
    if (data.employeeId !== undefined) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: data.employeeId },
      })

      if (!employee || !employee.active) {
        throw new BadRequestException('Funcionário não encontrado ou inativo.')
      }
    }

    // PROCURAR SERVIÇOS ATIVOS
    const serviceIds = [...new Set(data.items.map(item => item.serviceId))]

    const services = await this.prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        active: true,
      },
    })

    if (services.length !== serviceIds.length) {
      throw new BadRequestException(
        'Um ou mais serviços não existem ou estão inativos.',
      )
    }

    // CALCULAR TOTAL
    const serviceMap = new Map(services.map(service => [service.id, service]))

    let total = new Prisma.Decimal(0)

    const orderItems = data.items.map(item => {
      const service = serviceMap.get(item.serviceId)!
      const subtotal = service.price.mul(item.quantity)

      total = total.add(subtotal)

      return {
        serviceId: item.serviceId,
        quantity: item.quantity,
        unitPrice: service.price,
        subtotal,
      }
    })

    // CRIAR ENCOMENDA E ARTIGOS
    return this.prisma.$transaction(async tx => {
      return tx.order.create({
        data: {
          customerId: data.customerId,
          employeeId: data.employeeId,
          estimatedDeliveryAt: data.estimatedDeliveryAt
            ? new Date(data.estimatedDeliveryAt)
            : undefined,
          notes: data.notes,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              service: true,
            },
          },
        },
      })
    })
  }

  // ATUALIZAR ENCOMENDA
  async update (id: number, data: UpdateOrderDto) {
    const currentOrder = await this.findOne(id)

    // VALIDAR TRANSIÇÃO DE ESTADO
    if (data.status !== undefined && data.status !== currentOrder.status) {
      const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        RECEIVED: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
        IN_PROGRESS: [OrderStatus.READY, OrderStatus.CANCELLED],
        READY: [OrderStatus.DELIVERED],
        DELIVERED: [],
        CANCELLED: [],
      }

      if (!allowedTransitions[currentOrder.status].includes(data.status)) {
        throw new BadRequestException(
          `Não é permitido alterar de ${currentOrder.status} para ${data.status}.`,
        )
      }
    }

    // VERIFICAR FUNCIONÁRIO
    if (data.employeeId !== undefined) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: data.employeeId },
      })

      if (!employee || !employee.active) {
        throw new BadRequestException('Funcionário não encontrado ou inativo.')
      }
    }

    // PREPARAR DADOS
    const updateData: Prisma.OrderUpdateInput = {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.estimatedDeliveryAt !== undefined && {
        estimatedDeliveryAt: new Date(data.estimatedDeliveryAt),
      }),
      ...(data.employeeId !== undefined && {
        employee: {
          connect: { id: data.employeeId },
        },
      }),
    }

    // REGISTAR DATA REAL DE ENTREGA
    if (data.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date()
    } else if (data.status !== undefined) {
      updateData.deliveredAt = null
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            service: true,
          },
        },
        payment: true,
      },
    })
  }
}
