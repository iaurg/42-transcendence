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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';
import { User } from '@prisma/client';
import { Request } from 'express';
import { RemoveUsersFieldsInterceptor } from 'src/interceptors/remove-users-fields/remove-users-fields.interceptor';

@Controller('users')
@UseInterceptors(RemoveUsersFieldsInterceptor)
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  findMe(@Req() req: Request) {
    try {
      const user = req.user as User;
      return this.service.findOne(user.login);
    } catch (error) {
      return error;
    }
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
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(login, updateUserDto);
  }
}
