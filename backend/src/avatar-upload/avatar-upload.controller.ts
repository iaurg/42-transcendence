import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AvatarUploadService } from './avatar-upload.service';
import { CreateAvatarUploadDto } from './dto/create-avatar-upload.dto';
import { UpdateAvatarUploadDto } from './dto/update-avatar-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

const fileValidators = [
  new MaxFileSizeValidator({
    // 1MB
    maxSize: 1024 * 1024,
  }),
  new FileTypeValidator({ fileType: /image\/(png|jpg|gif)/ }),
];

@Controller('avatar-upload')
export class AvatarUploadController {
  constructor(private readonly avatarUploadService: AvatarUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createAvatarUploadDto: CreateAvatarUploadDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      createAvatarUploadDto,
      file: file.originalname,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avatarUploadService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvatarUploadDto: UpdateAvatarUploadDto,
  ) {
    return this.avatarUploadService.update(+id, updateAvatarUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avatarUploadService.remove(+id);
  }
}
