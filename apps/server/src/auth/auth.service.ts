import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/access-token.dto';

/**
 * Interface representing the payload for the JWT token.
 */
interface TokenPayload {
  sub: string | number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Creates a JWT token for the given email.
   *
   * @param email - The email address for which the token is to be created.
   * @returns A promise that resolves to an object containing the access token.
   * @throws InternalServerErrorException - If an error occurs while creating the token.
   */
  async createToken(email: string): Promise<AccessTokenDto> {
    try {
      const userId = await this.generateRandomId();
      const payload: TokenPayload = {
        sub: userId,
        username: email,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        access_token: accessToken,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the token',
      );
    }
  }

  /**
   * Generates a random user ID.
   *
   * @returns A promise that resolves to a randomly generated user ID.
   */
  private async generateRandomId(): Promise<number> {
    return Math.floor(Math.random() * 1000000);
  }
}
