import { Module } from '@nestjs/common';
import { FireblocksController } from './fireblocks.controller';
import { FireblocksService } from './fireblocks.service';

@Module({
  controllers: [FireblocksController],
  providers: [FireblocksService],
})
export class FireblocksModule {}
