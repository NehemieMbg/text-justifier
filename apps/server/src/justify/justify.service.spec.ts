import { Test, TestingModule } from '@nestjs/testing';
import { JustifyService } from './justify.service';

const text =
  '“Athena came to represent a very particular form of nous—eminently practical, feminine, and earthy. She is the voice that comes to heroes in times of need, instilling in them a calm spirit, orienting their minds toward the perfect idea for victory and success, then giving them the energy to achieve this. To be visited by Athena was the highest blessing of them all, and it was her spirit that guided great generals and the best artists, inventors, and tradesmen. Under”';

const justifiedText =
  '“Athena  came  to  represent a very particular form of nous—eminently practical,\nfeminine,  and  earthy.  She is the voice that comes to heroes in times of need,\ninstilling  in them a calm spirit, orienting their minds toward the perfect idea\nfor  victory  and  success,  then  giving them the energy to achieve this. To be\nvisited  by  Athena  was the highest blessing of them all, and it was her spirit\nthat  guided  great  generals  and  the  best artists, inventors, and tradesmen.\nUnder”                                                                          ';

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

  describe('justifyText', () => {
    it('should justify the text', () => {
      const result = service.justifyText(text, 80);

      expect(result).toEqual(justifiedText);
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
