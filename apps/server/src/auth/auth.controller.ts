import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateTokenDto } from './dto/auth-post.dto';

@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createToken(@Body() body: CreateTokenDto) {
    return this.authService.createToken(body.email);
  }
}
