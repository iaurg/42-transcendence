import { Test, TestingModule } from '@nestjs/testing';
import { AvatarUploadController } from './avatar-upload.controller';
import { AvatarUploadService } from './avatar-upload.service';

describe('AvatarUploadController', () => {
  let controller: AvatarUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarUploadController],
      providers: [AvatarUploadService],
    }).compile();

    controller = module.get<AvatarUploadController>(AvatarUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
