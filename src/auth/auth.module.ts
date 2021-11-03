import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './authorization/role.guard';
import { AuthRole } from './authorization/role.enum';

export const jwtSecret = 'prismaDay2021';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      // I'm guessing registering this module ensures jwt strategy gets invoked
      secret: jwtSecret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
