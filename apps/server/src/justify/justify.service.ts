import { Injectable } from '@nestjs/common';

@Injectable()
export class JustifyService {
  justifyText() {
    return 'Justified text';
  }
}
