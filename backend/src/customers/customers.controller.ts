import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { CustomersService } from './customers.service.js'
import { CreateCustomerDto } from './dto/create-customer.dto.js'
import { UpdateCustomerDto } from './dto/update-customer.dto.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { RolesGuard } from '../auth/roles.guard.js'

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor (private readonly customersService: CustomersService) {}

  // LISTAR CLIENTES
  @Get()
  findAll () {
    return this.customersService.findAll()
  }

  // CONSULTAR CLIENTE
  @Get(':id')
  findOne (@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id)
  }

  // CRIAR CLIENTE
  @Post()
  create (@Body() data: CreateCustomerDto) {
    return this.customersService.create(data)
  }

  // ATUALIZAR CLIENTE
  @Patch(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, data)
  }

  // ELIMINAR CLIENTE
  @Roles('ADMIN')
  @Delete(':id')
  remove (@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id)
  }
}
