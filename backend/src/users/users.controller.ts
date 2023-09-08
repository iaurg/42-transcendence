import {
  Controller,
  Delete,
  Get,
  Body,
  Param,
  Patch,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user*')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  findMe(@Body() dto: any) {
    try {
      return this.service.findMe(dto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No user found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get()
  findAll() {
    try {
      return this.service.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No users found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':login')
  findOne(@Param('login') login: string) {
    try {
      return this.service.findOne(login);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No user found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.service.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User already exists',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Patch(':login')
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.service.update(login, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error: 'User not modified',
        },
        HttpStatus.NOT_MODIFIED,
        {
          cause: error,
        },
      );
    }
  }

  @Delete(':login')
  remove(@Param('login') login: string) {
    try {
      return this.service.remove(login);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error: 'User not deleted',
        },
        HttpStatus.NOT_MODIFIED,
        {
          cause: error,
        },
      );
    }
  }
}
