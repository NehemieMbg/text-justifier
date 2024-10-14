import { Module } from '@nestjs/common';
import { JustifyService } from './justify.service';
import { JustifyController } from './justify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [JustifyService, AuthService],
  controllers: [JustifyController],
})
export class JustifyModule {}
