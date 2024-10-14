import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockReturnValue({}),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const user = {
    id: 12345,
    email: 'naomie.liu@gmail.com',
    username: 'naomie.liu@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked_token'), // Mocking signAsync
            verifyAsync: jest
              .fn()
              .mockResolvedValue({ sub: user.id, username: user.email }), // Mocking verifyAsync
          },
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
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.createToken(user.email);

      expect(result).toEqual({ access_token: 'mocked_token' }); // Match the mocked token
      expect(jwtService.signAsync).toHaveBeenCalled(); // Check if signAsync was called
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.email,
      });
    });

    it('should create a token with the correct payload', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);

      const userToken = await service.createToken(user.email);
      const payload = await jwtService.verifyAsync(userToken.access_token);

      expect(payload).toHaveProperty('sub');
      expect(payload).toHaveProperty('username');
    });

    it('should throw an InternalServerErrorException if not valid secret key', async () => {
      const fakeJwtService = new JwtService(); // No valid secret key for this instance.
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: getRepositoryToken(User),
            useValue: mockUserRepository,
          },
          {
            provide: JwtService,
            useValue: fakeJwtService,
          },
        ],
      }).compile();

      const fakeService = module.get<AuthService>(AuthService);
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(fakeService.createToken(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneOrCreate', () => {
    it('should find an existing user', async () => {
      mockUserRepository.findOne.mockResolvedValue(user);

      const foundUser = await service.findOneOrCreate(user.email);

      expect(foundUser).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: user.email },
      });
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(service.findOneOrCreate(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
