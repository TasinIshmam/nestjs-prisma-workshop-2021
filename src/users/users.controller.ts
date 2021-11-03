import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthEntity } from '../auth/entity/auth.entity';
import { RolesGuard } from '../auth/authorization/role.guard';
import { Roles } from '../auth/authorization/roles.decorator';
import { AuthRole } from '../auth/authorization/role.enum';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth() // this is just a swagger tag.
  @ApiOkResponse({ type: UserEntity })
  async getSelf(@Request() req) {
    return new UserEntity(req.user);
  }

  // Todo: implement after figuring out how to do authorization
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth() // this is just a swagger tag.
  @Roles(AuthRole.Admin)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth() // this is just a swagger tag.
  @Roles(AuthRole.Admin)
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth() // this is just a swagger tag.
  @Roles(AuthRole.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  @ApiBearerAuth()
  @Roles(AuthRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // @Get('TestNormal')
  // @UseGuards(JwtAuthGuard, RolesGuard) // this is what does the verification and adds req.user
  // @ApiBearerAuth() // this is just a swagger tag.
  // @Roles(AuthRole.User)
  // @ApiOkResponse({ type: UserEntity })
  // async testNormal(@Request() req) {
  //   return new UserEntity(req.user);
  // }
  //
  // @Get('TestAdmin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth() // this is just a swagger tag.
  // @ApiOkResponse({ type: UserEntity })
  // @Roles(AuthRole.Admin)
  // async testAdmin(@Request() req) {
  //   return new UserEntity(req.user);
  // }
}
