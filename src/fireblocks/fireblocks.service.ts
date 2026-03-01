import { Injectable } from '@nestjs/common';
import { Fireblocks } from '@fireblocks/ts-sdk';

@Injectable()
export class FireblocksService {
  async getFireblocksInfo(): Promise<string> {
    const fireblocks = new Fireblocks({
      apiKey: '',
      secretKey: ``,
      basePath: 'https://api.fireblocks.io/v1',
    });

    // Get all assets and addresses for the vault account in one call
    /*
    const vaultResponse = await fireblocks.blockchainsAssets.listBlockchains();
    const vaultResponse = await fireblocks.blockchainsAssets.listAssets();
    const vaultResponse = await fireblocks.blockchainsAssets.getSupportedAssets();
    const vaultResponse = await fireblocks.vaults.getVaultAccount({
      vaultAccountId: '3',
    });
    const vaultResponse = await fireblocks.vaults.getVaultAssets({
      accountNamePrefix: 'wanhua',
    });
    const vaultResponse = await fireblocks.vaults.getAssetWallets();
    const vaultResponse = await fireblocks.vaults.getVaultAccountAsset ({
      vaultAccountId: 'wanhua',
      assetId: 'ETH_TEST5',
    });*/
    const vaultResponse = await fireblocks.vaults.getVaultAccount({
      vaultAccountId: '3',
    });
    return JSON.stringify(vaultResponse, null, 2);
  }
}
