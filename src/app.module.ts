import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitgoModule } from './bitgo/bitgo.module';
import { BitgoNoSdkModule } from './bitgo-no-sdk/bitgo-no-sdk.module';
import { AnchorageModule } from './anchorage/anchorage.module';

@Module({
  imports: [BitgoModule, BitgoNoSdkModule, AnchorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
