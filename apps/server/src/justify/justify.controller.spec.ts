import { Test, TestingModule } from '@nestjs/testing';
import { JustifyController } from './justify.controller';

describe('JustifyController', () => {
  let controller: JustifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JustifyController],
    }).compile();

    controller = module.get<JustifyController>(JustifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
