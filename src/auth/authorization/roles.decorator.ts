import { SetMetadata } from '@nestjs/common';
import { AuthRole } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (role: AuthRole) => SetMetadata(ROLES_KEY, role);
