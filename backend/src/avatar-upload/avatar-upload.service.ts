import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Express } from 'express';
import 'multer';
@Injectable()
export class AvatarUploadService {
  constructor(private prisma: PrismaService) {}

  async create(id: string, file: Express.Multer.File) {
    const { filename } = file;
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
    });

    return user;
  }

  async update(id: string, file: Express.Multer.File) {
    const { filename } = file;
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
    });

    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { avatar: null },
    });

    return user;
  }
}
