//src/auth/jwt.strategy.ts
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { AuthPayload } from './dto/auth-payload.dto';
import { Role } from './authorization/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: AuthPayload) {
    // console.log(payload);
    const user = await this.auth.validateUser(payload.userId);

    if (!user) {
      console.log('throwing unauthorized exception');
      throw new UnauthorizedException();
    }

    return {
      ...user,
      roles: [Role.User],
    };
  }
}
