import { Test, TestingModule } from '@nestjs/testing';
import { AvatarUploadService } from './avatar-upload.service';

describe('AvatarUploadService', () => {
  let service: AvatarUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarUploadService],
    }).compile();

    service = module.get<AvatarUploadService>(AvatarUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
