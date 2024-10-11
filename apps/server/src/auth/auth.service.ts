import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  createToken(email: string): string {
    return email;
  }
}
