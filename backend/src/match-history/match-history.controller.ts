import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';

//TODO: add auth guard
@Controller('match-history')
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
