import { Controller, Get, Param } from '@nestjs/common';
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

  /**
   * GET /anchorage/vaults/:vaultId/wallets
   * Get all wallets for a specific vault
   * @param vaultId - The vault ID
   */
  @Get('vaults/:vaultId/wallets')
  async getVaultWallets(@Param('vaultId') vaultId: string) {
    return this.anchorageService.getVaultWallets(vaultId);
  }
}
