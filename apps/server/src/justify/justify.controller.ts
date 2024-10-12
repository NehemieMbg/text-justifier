import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JustifyService } from './justify.service';

@Controller('justify')
export class JustifyController {
  constructor(private readonly justifyService: JustifyService) {}

  @Post()
  @UseGuards(AuthGuard)
  justifyText(@Body() text: string) {
    return text;
  }
}
