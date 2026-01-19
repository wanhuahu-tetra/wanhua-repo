import { Controller, Get } from '@nestjs/common';
import { AnchorageService } from './anchorage.service';

@Controller('anchorage')
export class AnchorageController {
  constructor(private readonly anchorageService: AnchorageService) {}

  /**
   * GET /anchorage/asset-types
   * Get all available asset types from Anchorage
   */
  @Get('asset-types')
  async getAssetTypes() {
    return this.anchorageService.getAssetTypes();
  }
}
