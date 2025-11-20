import { Module } from '@nestjs/common';
import { BitgoService } from './bitgo.service';
import { BitgoController } from './bitgo.controller';

@Module({
  providers: [BitgoService],
  controllers: [BitgoController],
  exports: [BitgoService],
})
export class BitgoModule {}
