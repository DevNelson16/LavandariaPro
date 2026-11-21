import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'

import { Prisma, PaymentStatus, OrderStatus } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service.js'
import { CreatePaymentDto } from './dto/create-payment.dto.js'
import { UpdatePaymentDto } from './dto/update-payment.dto.js'

@Injectable()
export class PaymentsService {
  constructor (private readonly prisma: PrismaService) {}

  // LISTAR PAGAMENTOS
  async findAll () {
    return this.prisma.payment.findMany({
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                service: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // CONSULTAR PAGAMENTO POR ID
  async findOne (id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    })

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado.')
    }

    return payment
  }

  // CRIAR PAGAMENTO
  async create (data: CreatePaymentDto) {
    // VERIFICAR SE A ENCOMENDA EXISTE
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        payment: true,
      },
    })

    if (!order) {
      throw new NotFoundException('Encomenda não encontrada.')
    }

    // IMPEDIR PAGAMENTO DE ENCOMENDAS CANCELADAS
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(
        'Não é possível registar pagamento para uma encomenda cancelada.',
      )
    }

    // IMPEDIR DOIS PAGAMENTOS PARA A MESMA ENCOMENDA
    if (order.payment) {
      throw new ConflictException(
        'Esta encomenda já possui um pagamento registado.',
      )
    }

    // CRIAR PAGAMENTO COM O TOTAL DA ENCOMENDA
    try {
      return await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          method: data.method,
          status: PaymentStatus.PENDING,
        },
        include: {
          order: true,
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Esta encomenda já possui um pagamento registado.',
        )
      }

      throw error
    }
  }

  // ATUALIZAR ESTADO DO PAGAMENTO
  async update (id: number, data: UpdatePaymentDto) {
    const payment = await this.findOne(id)

    // IMPEDIR TRANSIÇÕES INVÁLIDAS
    if (
      payment.status === PaymentStatus.PENDING &&
      data.status === PaymentStatus.REFUNDED
    ) {
      throw new BadRequestException(
        'Não é possível reembolsar um pagamento que ainda não foi efetuado.',
      )
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException(
        'Um pagamento reembolsado não pode ser alterado.',
      )
    }

    if (
      payment.status === PaymentStatus.PAID &&
      data.status === PaymentStatus.PENDING
    ) {
      throw new BadRequestException(
        'Um pagamento efetuado não pode voltar ao estado pendente.',
      )
    }

    if (payment.status === data.status) {
      throw new BadRequestException('O pagamento já se encontra nesse estado.')
    }

    const updateData: Prisma.PaymentUpdateInput = {
      status: data.status,
    }

    // REGISTAR DATA DO PAGAMENTO
    if (data.status === PaymentStatus.PAID) {
      updateData.paidAt = new Date()
    }

    return this.prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
      },
    })
  }
}
