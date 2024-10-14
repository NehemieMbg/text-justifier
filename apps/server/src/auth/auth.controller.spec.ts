import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

const mockAuthService = {
  createToken: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'secret_key_test' }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token successfully', async () => {
      const result = await controller.createToken({
        email: 'naomie.liu@test.com',
      });

      expect(result).toEqual({ access_token: expect.any(String) });
      expect(authService.createToken).toHaveBeenCalledWith(
        'naomie.liu@test.com',
      );
      expect(authService.createToken).toHaveBeenCalledTimes(1);
    });
  });
});
