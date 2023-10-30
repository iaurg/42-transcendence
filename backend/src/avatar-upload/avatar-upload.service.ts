import { Injectable } from '@nestjs/common';
import { CreateAvatarUploadDto } from './dto/create-avatar-upload.dto';
import { UpdateAvatarUploadDto } from './dto/update-avatar-upload.dto';

@Injectable()
export class AvatarUploadService {
  create(createAvatarUploadDto: CreateAvatarUploadDto) {
    return 'This action adds a new avatarUpload';
  }

  findOne(id: number) {
    return `This action returns a #${id} avatarUpload`;
  }

  update(id: number, updateAvatarUploadDto: UpdateAvatarUploadDto) {
    return `This action updates a #${id} avatarUpload`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatarUpload`;
  }
}
