import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvatarUploadService {
  constructor(private prisma: PrismaService) {}

  async create(id: string, file: Express.Multer.File) {
    const { filename } = file;

    // Validate the file type and size
    if (!file.mimetype.startsWith('image/') || file.size > 1024 * 1024) {
      throw new BadRequestException('Invalid file');
    }

    const user = await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
      select: { id: true, avatar: true }, // Select only the fields that are safe to return
    });

    return user;
  }

  async update(id: string, file: Express.Multer.File) {
    const { filename } = file;

    // Validate the file type and size
    if (!file.mimetype.startsWith('image/') || file.size > 1024 * 1024) {
      throw new BadRequestException('Invalid file');
    }

    const user = await this.prisma.user.update({
      where: { id: id },
      data: { avatar: filename },
      select: { id: true, avatar: true }, // Select only the fields that are safe to return
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
