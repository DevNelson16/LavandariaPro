import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PaymentsService } from './payments.service.js'
import { CreatePaymentDto } from './dto/create-payment.dto.js'
import { UpdatePaymentDto } from './dto/update-payment.dto.js'
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor (private readonly paymentsService: PaymentsService) {}

  // LISTAR PAGAMENTOS
  @Get()
  findAll () {
    return this.paymentsService.findAll()
  }

  // CONSULTAR PAGAMENTO POR ID
  @Get(':id')
  findOne (@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id)
  }

  // CRIAR PAGAMENTO
  @Roles('ADMIN')
  @Post()
  create (@Body() data: CreatePaymentDto) {
    return this.paymentsService.create(data)
  }

  // ATUALIZAR ESTADO DO PAGAMENTO
  @Roles('ADMIN')
  @Patch(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, data)
  }
}
