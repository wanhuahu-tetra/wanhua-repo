import { Module } from '@nestjs/common';
import { BitgoNoSdkService } from './bitgo-no-sdk.service';
import { BitgoNoSdkController } from './bitgo-no-sdk.controller';

@Module({
  controllers: [BitgoNoSdkController],
  providers: [BitgoNoSdkService],
  exports: [BitgoNoSdkService],
})
export class BitgoNoSdkModule {}
