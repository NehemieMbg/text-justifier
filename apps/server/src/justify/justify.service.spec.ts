import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { justifiedText, text } from '../../constants';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.entity';
import { JustifyService } from './justify.service';

describe('JustifyService', () => {
  let service: JustifyService;

  const mockUserRepository = {
    save: jest.fn(),
  };

  const mockAuthService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JustifyService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<JustifyService>(JustifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('justifyText', () => {
    it('should justify the text', async () => {
      const mockUser = {
        username: 'naomie.liue@test.com',
        dailyWordCount: 0,
        lastJustified: new Date().toISOString().split('T')[0],
      };

      // Mock the behavior of findOne
      mockAuthService.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.justifyText(
        text,
        'naomie.liue@test.com',
        80,
      );

      expect(result).toEqual(justifiedText);
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        dailyWordCount: expect.any(Number), // Check if the daily word count is updated
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthService.findOne.mockResolvedValue(null);

      await expect(
        service.justifyText(text, 'unknownUser', 80),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if daily word limit is exceeded', async () => {
      const mockUser = {
        username: 'naomie.liue@test.com',
        dailyWordCount: 80_000,
        lastJustified: new Date().toISOString().split('T')[0],
      };

      mockAuthService.findOne.mockResolvedValue(mockUser);

      await expect(
        service.justifyText(text, 'naomie.liue@test.com', 80),
      ).rejects.toThrow(
        new HttpException(
          'Daily word limit exceeded (80,000 words)',
          HttpStatus.PAYMENT_REQUIRED,
        ),
      );
    });
  });

  describe('fullJustify', () => {
    it('should fully justify the text', () => {
      const result = service['fullJustify'](text.split(' '), 80);
      expect(result).toEqual(justifiedText);
    });

    it('should fully justify to the correct length', () => {
      const justifiedText = service['fullJustify'](text.split(' '), 80);
      const lines = justifiedText.split('\n');

      for (const line of lines) {
        expect(line.length).toEqual(80);
      }
    });
  });
});
