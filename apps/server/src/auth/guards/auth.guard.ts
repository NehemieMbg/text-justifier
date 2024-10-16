import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

export interface RequestWithUser extends Request {
  user: { sub: string | number; username: string };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  /**
   * Determines if the request can proceed based on the presence and validity of a JWT token.
   *
   * @param context - The execution context which provides details about the current request.
   * @returns A promise that resolves to a boolean indicating whether the request is authorized.
   * @throws UnauthorizedException - If the token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!(await this.authService.findOne(payload.username))) {
        new UnauthorizedException();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header of the request.
   *
   * @param request - The incoming HTTP request.
   * @returns The extracted token if present and valid, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
