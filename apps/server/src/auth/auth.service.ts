import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/access-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * Interface representing the payload for the JWT token.
 */
interface TokenPayload {
  sub: string | number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a JWT token for the given email.
   *
   * @param email - The email address for which the token is to be created.
   * @returns A promise that resolves to an object containing the access token.
   * @throws InternalServerErrorException - If an error occurs while creating the token.
   */
  async createToken(email: string): Promise<AccessTokenDto> {
    const user: User = await this.findOneOrCreate(email);

    try {
      const payload: TokenPayload = {
        sub: user.id,
        username: email,
      };

      const accessToken: string = await this.jwtService.signAsync(payload);

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
   * Finds a user by the given email address or creates a new user if one does not exist.
   *
   * @param email - The email address of the user to find or create.
   * @returns A promise that resolves to the user.
   * @throws InternalServerErrorException - If an error occurs while finding or creating the user.
   */
  async findOneOrCreate(email: string): Promise<User> {
    try {
      const user: User = await this.findOne(email);

      if (user) {
        return user;
      }

      const newUser: User = new User();
      newUser.username = email;

      this.userRepository.create();
      await this.userRepository.save(newUser);

      return newUser;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error occurred while finding or creating the user',
      );
    }
  }

  /**
   * Finds a user by the given username.
   *
   * @param username - The username of the user to find.
   * @returns A promise that resolves to the user.
   */
  async findOne(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }
}
