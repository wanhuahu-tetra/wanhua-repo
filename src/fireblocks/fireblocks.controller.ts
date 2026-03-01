import { Controller, Get } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';

@Controller('fireblocks')
export class FireblocksController {
  constructor(private readonly fireblocksService: FireblocksService) {}

  @Get()
  async getFireblocksInfo(): Promise<string> {
    return await this.fireblocksService.getFireblocksInfo();
  }
}