import { Module } from '@nestjs/common';
import { AnchorageService } from './anchorage.service';
import { AnchorageController } from './anchorage.controller';

@Module({
  controllers: [AnchorageController],
  providers: [AnchorageService],
  exports: [AnchorageService],
})
export class AnchorageModule {}
