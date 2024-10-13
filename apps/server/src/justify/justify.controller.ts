import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JustifyService } from './justify.service';

@Controller('justify')
export class JustifyController {
  constructor(private readonly justifyService: JustifyService) {}

  /**
   * Endpoint to justify the given text.
   *
   * @param text - The text to be justified.
   * @returns The justified text.
   */
  @Post()
  @UseGuards(AuthGuard)
  justifyText(@Body() text: string): string {
    return this.justifyService.justifyText(text);
  }
}
