import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnchorageService {
  private readonly logger = new Logger(AnchorageService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = 'https://api.anchorage-staging.com';
    this.apiKey = process.env.ANCHORAGE_API_KEY || '';
  }

  /**
   * Make authenticated API call to Anchorage
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Api-Access-Key': this.apiKey,
      'accept': 'application/json',
      ...options.headers,
    };

    this.logger.log(`Making request to: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(
        `Anchorage API Error: ${response.status} - ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Get all available asset types from Anchorage
   * @returns List of asset types supported by Anchorage
   */
  async getAssetTypes() {
    try {
      this.logger.log('Fetching asset types from Anchorage');

      const endpoint = '/v2/asset-types';
      const response = await this.request(endpoint);

      this.logger.log(
        `Found ${response.assetTypes?.length || response.length || 0} asset types`,
      );

      return response;
    } catch (error) {
      this.logger.error('Error fetching asset types:', error.message);
      throw error;
    }
  }

  /**
   * Get all wallets for a specific vault
   * @param vaultId - The vault ID
   * @returns List of wallets in the vault
   */
  async getVaultWallets(vaultId: string) {
    try {
      this.logger.log(`Fetching wallets for vault ${vaultId} from Anchorage`);

      const endpoint = `/v2/vaults/${vaultId}/wallets`;
      const response = await this.request(endpoint);

      this.logger.log(
        `Found ${response.wallets?.length || response.length || 0} wallets for vault ${vaultId}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching wallets for vault ${vaultId}:`,
        error.message,
      );
      throw error;
    }
  }
}
