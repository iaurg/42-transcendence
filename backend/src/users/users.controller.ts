import {
  Controller,
  Delete,
  Get,
  Body,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  findMe(@Req() req: Request) {
    try {
      const user = req.user as User;
      return this.service.findOne(user.login, {
        login: true,
        displayName: true,
        email: true,
        avatar: true,
        status: true,
        victory: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
      });
    } catch (error) {
      return error;
    }
  }

  @Get()
  findAll() {
    return this.service.findAll({
      select: {
        login: true,
        displayName: true,
        email: true,
        avatar: true,
        status: true,
        victory: true,
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Get(':login')
  findOne(@Param('login') login: string) {
    return this.service.findOne(login, {
      login: true,
      displayName: true,
      email: true,
      avatar: true,
      status: true,
      victory: true,
      mfaEnabled: true,
      createdAt: true,
      updatedAt: true,
    });
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Patch(':login')
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(login, updateUserDto);
  }

  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.service.remove(login);
  }
}
