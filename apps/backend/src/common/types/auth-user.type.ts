import { Role } from '@prisma/client';

export type AuthUser = {
  userId: string;
  tenantId: string;
  role: Role;
  email: string;
};
