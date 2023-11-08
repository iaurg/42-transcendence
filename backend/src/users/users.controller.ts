import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserDto } from './dto/patchUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';
import { User } from '@prisma/client';
import { Request } from 'express';
import { RemoveUsersFieldsInterceptor } from 'src/interceptors/remove-users-fields/remove-users-fields.interceptor';

@Controller('users')
@UseGuards(AccessTokenGuard)
@UseInterceptors(RemoveUsersFieldsInterceptor)
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  findMe(@Req() request: Request & { user: User }) {
    const { login } = request.user;
    return this.service.findOne(login);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    const user = await this.service.findOne(login);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Patch()
  update(
    @Req() request: Request & { user: User },
    @Body() updateUserDto: PatchUserDto,
  ) {
    const { user } = request;

    if (!user.login) {
      throw new UnauthorizedException('User not found.');
    }

    return this.service.update(user.login, updateUserDto);
  }
}
