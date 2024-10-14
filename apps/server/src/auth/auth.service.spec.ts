import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const user = { id: 12345, email: 'naomie.liu@gmail.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'secret_key_test' }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a token successfully', async () => {
      const result = await service.createToken(user.email);

      expect(result).toEqual({ access_token: expect.any(String) });
    });

    it('should create a token with the correct payload', async () => {
      const userToken = await service.createToken(user.email);

      const payload = await jwtService.verifyAsync(userToken.access_token);

      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('username');
    });

    it('should throw an InternalServerErrorException if not valid secret key', async () => {
      const fakeJwtService = new JwtService();

      // ? This is a way to mock the signAsync method of the JwtService
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: JwtService,
            useValue: fakeJwtService,
          },
        ],
      }).compile();

      const fakeService = module.get<AuthService>(AuthService);

      expect(fakeService).toBeDefined();
      // ? We expect the createToken method to throw an InternalServerErrorException
      await expect(fakeService.createToken(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('generateRandomId', () => {
    it('should generate a random ID', async () => {
      const result = await service['generateRandomId']();

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1000000);
    });
  });
});
