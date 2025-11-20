import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitgoModule } from './bitgo/bitgo.module';

@Module({
  imports: [BitgoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
