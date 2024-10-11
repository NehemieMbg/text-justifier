import { Module } from '@nestjs/common';
import { JustifyService } from './justify.service';
import { JustifyController } from './justify.controller';

@Module({
  providers: [JustifyService],
  controllers: [JustifyController]
})
export class JustifyModule {}
