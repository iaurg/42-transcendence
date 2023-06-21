import {
  Controller,
  Delete,
  Get,
  Body,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user*')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  findMe(@Body() dto: any) {
    return this.service.findMe(dto);
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

  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.service.remove(login);
  }
}
