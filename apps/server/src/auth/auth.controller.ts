import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/auth-post.dto';

/**
 * AuthController handles the authentication-related routes.
 * It defines the endpoints for creating tokens and other authentication operations.
 */
@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * POST /token
   * Creates a new access token.
   *
   * @param body - The data transfer object containing the email for which the token is to be created.
   * @returns The created token.
   */
  @Post()
  createToken(@Body() body: CreateTokenDto) {
    return this.authService.createToken(body.email);
  }
}
