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
import { EmployeesService } from './employees.service.js'
import { CreateEmployeeDto } from './dto/create-employee.dto.js'
import { UpdateEmployeeDto } from './dto/update-employee.dto.js'
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class EmployeesController {
  constructor (private readonly employeesService: EmployeesService) {}

  // LISTAR FUNCIONÁRIOS
  @Get()
  findAll () {
    return this.employeesService.findAll()
  }

  // CONSULTAR FUNCIONÁRIO POR ID
  @Get(':id')
  findOne (@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id)
  }

  // REGISTAR FUNCIONÁRIO
  @Post()
  create (@Body() data: CreateEmployeeDto) {
    return this.employeesService.create(data)
  }

  // ATUALIZAR FUNCIONÁRIO
  @Patch(':id')
  update (
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, data)
  }

  // ATIVAR OU DESATIVAR FUNCIONÁRIO
  @Patch(':id/status')
  setActive (
    @Param('id', ParseIntPipe) id: number,
    @Query('active', ParseBoolPipe) active: boolean,
  ) {
    return this.employeesService.setActive(id, active)
  }
}
