import { Test, TestingModule } from '@nestjs/testing';
import { JustifyController } from './justify.controller';
import { JustifyService } from './justify.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

const text =
  '“Athena came to represent a very particular form of nous—eminently practical, feminine, and earthy. She is the voice that comes to heroes in times of need, instilling in them a calm spirit, orienting their minds toward the perfect idea for victory and success, then giving them the energy to achieve this. To be visited by Athena was the highest blessing of them all, and it was her spirit that guided great generals and the best artists, inventors, and tradesmen. Under”';

const justifiedText =
  '“Athena  came  to  represent a very particular form of nous—eminently practical,\nfeminine,  and  earthy.  She is the voice that comes to heroes in times of need,\ninstilling  in them a calm spirit, orienting their minds toward the perfect idea\nfor  victory  and  success,  then  giving them the energy to achieve this. To be\nvisited  by  Athena  was the highest blessing of them all, and it was her spirit\nthat  guided  great  generals  and  the  best artists, inventors, and tradesmen.\nUnder”                                                                          ';

describe('JustifyController', () => {
  let controller: JustifyController;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JustifyController],
      providers: [
        JustifyService,
        {
          provide: APP_GUARD,
          useValue: mockAuthGuard,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<JustifyController>(JustifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('justifyText', () => {
    it('should justify the text', () => {
      const result = controller.justifyText(text);

      expect(result).toEqual(justifiedText);
    });
  });
});
