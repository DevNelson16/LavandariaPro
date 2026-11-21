import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OrdersService } from './orders.service.js'
import { CreateOrderDto } from './dto/create-order.dto.js'
import { UpdateOrderDto } from './dto/update-order.dto.js'
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor (private readonly ordersService: OrdersService) {}

  // LISTAR ENCOMENDAS
  @Get()
  findAll () {
    return this.ordersService.findAll()
  }

  // CONSULTAR ENCOMENDA POR ID
  @Get(':id')
  findOne (@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id)
  }

  // CRIAR ENCOMENDA
  @Post()
  create (@Body() data: CreateOrderDto) {
    return this.ordersService.create(data)
  }

  // ATUALIZAR ENCOMENDA
  @Patch(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderDto,
    @Req() request: AuthenticatedRequest,
  ) {
    if (
      request.user.role !== 'ADMIN' &&
      (data.employeeId !== undefined || data.estimatedDeliveryAt !== undefined)
    ) {
      throw new ForbiddenException(
        'Não tens permissão para alterar estes dados.',
      )
    }

    return this.ordersService.update(id, data)
  }
}
