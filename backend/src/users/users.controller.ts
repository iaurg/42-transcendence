import { Controller, Get, Body, Query, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user*')
export class UsersController {
  constructor(private service: UsersService) { }

  @Post()
  async create(@Query() userDto: CreateUserDto) {
    try {
      const createdUser = await this.service.create(userDto);
      return { message: "User successfully created", data: createdUser }
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async find(@Query() userDto: CreateUserDto) {
    try {
      if (userDto.login) {
        return await this.service.find(userDto);
      }
      return await this.service.listAll();
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('me')
  findMe(@Body() dto: any) {
    return this.service.findMe(dto);
  }
}
