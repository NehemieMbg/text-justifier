import { Test, TestingModule } from '@nestjs/testing';
import { JustifyController } from './justify.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JustifyService } from './justify.service';

const fakeJustifyService = {
  justifyMethod: jest.fn().mockResolvedValue('Justified text'),
};

const fakeAuthService = {
  validateUser: jest.fn().mockResolvedValue(true),
};

describe('JustifyController', () => {
  let controller: JustifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JustifyController],
      providers: [
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'test' }),
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: JustifyService,
          useValue: fakeJustifyService,
        },
      ],
    }).compile();

    controller = module.get<JustifyController>(JustifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
