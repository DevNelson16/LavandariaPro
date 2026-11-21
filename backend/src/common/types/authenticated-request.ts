import { Request } from 'express';
import { EmployeeRole } from '@prisma/client';

export type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: EmployeeRole;
  };
};