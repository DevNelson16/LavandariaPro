import {
  PrismaClient,
  EmployeeRole,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('A iniciar Seed...');

  // 1. CRIAR CLIENTES

  const customersData = [
    {
      name: 'João Silva',
      phone: '910000001',
      email: 'joao@example.com',
      address: 'Lisboa',
    },
    {
      name: 'Maria Santos',
      phone: '910000002',
      email: 'maria@example.com',
      address: 'Amadora',
    },
    {
      name: 'Pedro Costa',
      phone: '910000003',
      email: 'pedro@example.com',
      address: 'Odivelas',
    },
    {
      name: 'Ana Ferreira',
      phone: '910000004',
      email: 'ana@example.com',
      address: 'Loures',
    },
    {
      name: 'Carlos Mendes',
      phone: '910000005',
      email: 'carlos@example.com',
      address: 'Lisboa',
    },
  ];

  const customers = [];

  for (const customer of customersData) {
    const result = await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: customer,
      create: customer,
    });

    customers.push(result);
  }

  console.log('5 clientes criados/verificados.');

  // 2. CRIAR FUNCIONÁRIOS

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const employeePassword = await bcrypt.hash('Employee123!', 10);

  const admin = await prisma.employee.upsert({
    where: { email: 'admin@lavandariapro.pt' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@lavandariapro.pt',
      password: adminPassword,
      role: EmployeeRole.ADMIN,
    },
  });

  const employee = await prisma.employee.upsert({
    where: { email: 'funcionario@lavandariapro.pt' },
    update: {},
    create: {
      name: 'Funcionário',
      email: 'funcionario@lavandariapro.pt',
      password: employeePassword,
      role: EmployeeRole.EMPLOYEE,
    },
  });

  console.log('2 funcionários criados/verificados.');

  // 3. CRIAR SERVIÇOS

  const servicesData = [
    { name: 'Lavagem normal', description: 'Lavagem de roupa normal.', price: 5 },
    { name: 'Engomadoria', description: 'Serviço de engomadoria.', price: 5 },
    { name: 'Limpeza a seco', description: 'Limpeza profissional a seco.', price: 12 },
    { name: 'Lavagem delicada', description: 'Lavagem de peças delicadas.', price: 8 },
    { name: 'Tratamento de fatos', description: 'Limpeza de fatos.', price: 13 },
    { name: 'Limpeza de calçado', description: 'Limpeza de calçado.', price: 7 },
  ];

  const services = [];

  for (const service of servicesData) {
    const result = await prisma.service.upsert({
      where: { name: service.name },
      update: {
        description: service.description,
        price: service.price,
      },
      create: service,
    });

    services.push(result);
  }

  console.log('6 serviços criados/verificados.');

  // 4. CRIAR ENCOMENDAS E PAGAMENTOS

  const existingOrders = await prisma.order.count();

  if (existingOrders === 0) {
    const demoOrders = [
      {
        customer: customers[0],
        employee: admin,
        status: OrderStatus.RECEIVED,
        total: 15,
        estimatedDeliveryAt: new Date('2026-11-15'),
        items: [
          { service: services[0], quantity: 2, unitPrice: 5, subtotal: 10 },
          { service: services[1], quantity: 1, unitPrice: 5, subtotal: 5 },
        ],
        payment: {
          method: PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
          paidAt: null,
        },
      },
      {
        customer: customers[1],
        employee,
        status: OrderStatus.IN_PROGRESS,
        total: 20,
        estimatedDeliveryAt: new Date('2026-11-14'),
        items: [
          { service: services[2], quantity: 1, unitPrice: 12, subtotal: 12 },
          { service: services[3], quantity: 1, unitPrice: 8, subtotal: 8 },
        ],
        payment: {
          method: PaymentMethod.MBWAY,
          status: PaymentStatus.PAID,
          paidAt: new Date('2026-11-12'),
        },
      },
      {
        customer: customers[2],
        employee,
        status: OrderStatus.READY,
        total: 12,
        estimatedDeliveryAt: new Date('2026-11-13'),
        items: [
          { service: services[0], quantity: 1, unitPrice: 5, subtotal: 5 },
          { service: services[5], quantity: 1, unitPrice: 7, subtotal: 7 },
        ],
        payment: {
          method: PaymentMethod.CARD,
          status: PaymentStatus.PAID,
          paidAt: new Date('2026-11-11'),
        },
      },
      {
        customer: customers[3],
        employee: admin,
        status: OrderStatus.DELIVERED,
        total: 18,
        estimatedDeliveryAt: new Date('2026-11-10'),
        deliveredAt: new Date('2026-11-10'),
        items: [
          { service: services[4], quantity: 1, unitPrice: 13, subtotal: 13 },
          { service: services[1], quantity: 1, unitPrice: 5, subtotal: 5 },
        ],
        payment: {
          method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PAID,
          paidAt: new Date('2026-11-10'),
        },
      },
      {
        customer: customers[4],
        employee: admin,
        status: OrderStatus.CANCELLED,
        total: 10,
        estimatedDeliveryAt: new Date('2026-11-12'),
        items: [
          { service: services[0], quantity: 1, unitPrice: 5, subtotal: 5 },
          { service: services[1], quantity: 1, unitPrice: 5, subtotal: 5 },
        ],
        payment: {
          method: PaymentMethod.CASH,
          status: PaymentStatus.REFUNDED,
          paidAt: new Date('2026-11-11'),
        },
      },
    ];

    for (const order of demoOrders) {
      await prisma.order.create({
        data: {
          customerId: order.customer.id,
          employeeId: order.employee.id,
          status: order.status,
          total: order.total,
          estimatedDeliveryAt: order.estimatedDeliveryAt,
          deliveredAt: order.deliveredAt ?? null,

          items: {
            create: order.items.map((item) => ({
              serviceId: item.service.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },

          payment: {
            create: {
              amount: order.total,
              method: order.payment.method,
              status: order.payment.status,
              paidAt: order.payment.paidAt,
            },
          },
        },
      });
    }

    console.log('5 encomendas e respetivos pagamentos criados.');
  } else {
    console.log('Já existem encomendas. Não foram criadas novas.');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((error) => {
    console.error('Erro ao executar Seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });