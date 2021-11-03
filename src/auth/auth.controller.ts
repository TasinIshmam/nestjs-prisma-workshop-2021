import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './authorization/role.enum';
import { Roles } from './authorization/roles.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RolesGuard } from './authorization/role.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: AuthEntity })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    return this.authService.login(email, password);
  }

  @Get('TestNormal')
  @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth() // this is just a swagger tag.
  @ApiOkResponse({ type: UserEntity })
  @Roles(Role.User)
  async getSelf(@Request() req) {
    return new UserEntity(req.user);
  }

  @Get('TestAdmin')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async testAdmin() {
    return 'bar';
  }
}
