import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard, RequestWithUser } from '../auth/guards/auth.guard';
import { JustifyService } from './justify.service';

@Controller('justify')
export class JustifyController {
  constructor(private readonly justifyService: JustifyService) {}

  /**
   * Endpoint to justify the given text.
   *
   * @param text - The text to be justified.
   * @param request - The incoming HTTP request. contains the user information.
   * @returns The justified text.
   */
  @Post()
  @UseGuards(AuthGuard)
  justifyText(
    @Body() text: string,
    @Request() request: RequestWithUser,
  ): Promise<string> {
    const userUsername: string = request.user.username;
    return this.justifyService.justifyText(text, userUsername);
  }
}
