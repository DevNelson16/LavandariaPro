import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { ServicesService } from './services.service.js'
import { CreateServiceDto } from './dto/create-service.dto.js'
import { UpdateServiceDto } from './dto/update-service.dto.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { RolesGuard } from '../auth/roles.guard.js'


@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor (private readonly servicesService: ServicesService) {}

  // LISTAR SERVIÇOS
  @Get()
  findAll () {
    return this.servicesService.findAll()
  }

  // CONSULTAR SERVIÇO POR ID
  @Get(':id')
  findOne (@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id)
  }

  // CRIAR SERVIÇO
  @Roles('ADMIN')
  @Post()
  create (@Body() data: CreateServiceDto) {
    return this.servicesService.create(data)
  }

  // ATUALIZAR SERVIÇO
  @Roles('ADMIN')
  @Patch(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, data)
  }

  // ATIVAR OU DESATIVAR SERVIÇO
  @Roles('ADMIN')
  @Patch(':id/status')
  setActive (
    @Param('id', ParseIntPipe) id: number,
    @Query('active', ParseBoolPipe) active: boolean,
  ) {
    return this.servicesService.setActive(id, active)
  }
}
