import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRole } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): any {
    const requiredRoles = this.reflector.getAllAndOverride<AuthRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    // console.log(requiredRoles);
    const { user } = context.switchToHttp().getRequest();
    // console.log(user);
    return this.matchRoles(requiredRoles, user.role);
  }

  private matchRoles(requiredRoles: AuthRole, userRole: Role) {
    const requiredRole = requiredRoles;

    if (userRole === 'ADMIN') {
      return true;
    }

    if (userRole === 'USER' && requiredRole === 'USER') {
      return true;
    }

    return false;
  }
}
