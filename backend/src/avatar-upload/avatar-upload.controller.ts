import {
  Controller,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AvatarUploadService } from './avatar-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';
import { User } from '@prisma/client';

const fileValidators = [
  new MaxFileSizeValidator({
    // 1MB
    maxSize: 1024 * 1024,
  }),
];

@Controller('avatar-upload')
@UseGuards(AccessTokenGuard)
export class AvatarUploadController {
  constructor(private readonly avatarUploadService: AvatarUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request & { user: User },
  ) {
    const { id } = request.user;

    return this.avatarUploadService.create(id, file);
  }

  @Patch()
  update(
    @UploadedFile(
      new ParseFilePipe({
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request & { user: User },
  ) {
    const { id } = request.user;

    return this.avatarUploadService.update(id, file);
  }

  @Delete()
  remove(@Req() request: Request & { user: User }) {
    const { id } = request.user;

    return this.avatarUploadService.remove(id);
  }
}
