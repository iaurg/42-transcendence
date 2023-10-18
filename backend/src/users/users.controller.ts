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
  findOne(@Param('login') login: string) {
    return this.service.findOne(login);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Patch(':login')
  update(
    @Req() request: Request & { user: User },
    @Param('login') login: string,
    @Body() updateUserDto: PatchUserDto,
  ) {
    const { user } = request;

    if (user.login !== login) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }

    return this.service.update(login, updateUserDto);
  }
}
