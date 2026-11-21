import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { CustomersModule } from './customers/customers.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { ServicesModule } from './services/services.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomersModule, EmployeesModule, ServicesModule, OrdersModule, PaymentsModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}