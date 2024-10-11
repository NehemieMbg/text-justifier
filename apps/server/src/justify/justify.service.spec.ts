import { Test, TestingModule } from '@nestjs/testing';
import { JustifyService } from './justify.service';

describe('JustifyService', () => {
  let service: JustifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JustifyService],
    }).compile();

    service = module.get<JustifyService>(JustifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
