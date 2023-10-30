import { PartialType } from '@nestjs/mapped-types';
import { CreateAvatarUploadDto } from './create-avatar-upload.dto';

export class UpdateAvatarUploadDto extends PartialType(CreateAvatarUploadDto) {}
