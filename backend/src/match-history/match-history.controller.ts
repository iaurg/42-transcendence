import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';

@Controller('match-history')
@UseGuards(AccessTokenGuard)
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Post()
  create(@Body() createMatchHistoryDto: CreateMatchHistoryDto) {
    return this.matchHistoryService.create(createMatchHistoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchHistoryService.findOne(id);
  }
}
