import { Module } from '@nestjs/common';
import { AvatarUploadService } from './avatar-upload.service';
import { AvatarUploadController } from './avatar-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = crypto.randomUUID();
          const extension = file.originalname.split('.').pop();
          return cb(null, `${randomName}.${extension}`);
        },
      }),
    }),
  ],
  controllers: [AvatarUploadController],
  providers: [AvatarUploadService, PrismaService],
})
export class AvatarUploadModule {}
