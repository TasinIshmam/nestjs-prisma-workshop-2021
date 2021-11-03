import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

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
}
