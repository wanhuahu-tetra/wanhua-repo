import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BitgoNoSdkService {
  private readonly logger = new Logger(BitgoNoSdkService.name);
  private readonly baseUrl: string;
  private readonly accessToken: string;

  constructor() {
    this.baseUrl = 'https://app.bitgo-test.com/api/v2';
    this.accessToken = process.env.ACCESS_TOKEN || '';
  }

  /**
   * Make authenticated API call to BitGo
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
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
        `BitGo API Error: ${response.status} - ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Get all wallets across all coins
   * @param enterprise - Optional enterprise ID to filter wallets
   * @returns List of all wallets with their details
   */
  async getWallets(enterprise?: string) {
    try {
      this.logger.log(
        `Fetching all wallets${enterprise ? ` for enterprise ${enterprise}` : ''}`,
      );

      const queryParams = new URLSearchParams();
      if (enterprise) {
        queryParams.append('enterprise', enterprise);
      }

      const endpoint = `/wallets?${queryParams.toString()}`;
      const response = await this.request(endpoint);

      this.logger.log(`Found ${response.wallets?.length || 0} wallets`);

      return response;
    } catch (error) {
      this.logger.error('Error fetching wallets:', error.message);
      throw error;
    }
  }

  /**
   * Get a specific wallet by coin and wallet ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @returns Wallet details with balance
   */
  async getWallet(coin: string, walletId: string) {
    try {
      this.logger.log(`Fetching wallet ${walletId} for coin: ${coin}`);

      const endpoint = `/${coin}/wallet/${walletId}`;
      const response = await this.request(endpoint);

      return response;
    } catch (error) {
      this.logger.error(`Error fetching wallet ${walletId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get wallet tokens with balance information
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @returns Wallet with token balances
   */
  async getWalletTokens(coin: string, walletId: string) {
    try {
      this.logger.log(
        `Fetching tokens for wallet ${walletId} on coin: ${coin}`,
      );

      const queryParams = new URLSearchParams({
        allTokens: 'true',
        includeBalance: 'true',
      });

      const endpoint = `/${coin}/wallet/${walletId}?${queryParams.toString()}`;
      const response = await this.request(endpoint);

      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching tokens for wallet ${walletId}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Get transactions for a specific wallet
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @param limit - Maximum number of transactions to return
   * @param prevId - Previous transaction ID for pagination
   * @returns List of transactions
   */
  async getTransactions(
    coin: string,
    walletId: string,
    limit: number = 25,
    prevId?: string,
  ) {
    try {
      this.logger.log(`Fetching transactions for wallet ${walletId} (${coin})`);

      const queryParams = new URLSearchParams({
        limit: limit.toString(),
      });

      if (prevId) {
        queryParams.append('prevId', prevId);
      }

      const endpoint = `/${coin}/wallet/${walletId}/transfer?${queryParams.toString()}`;
      const response = await this.request(endpoint);

      this.logger.log(
        `Found ${response.transfers?.length || 0} transactions for wallet ${walletId}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching transactions for wallet ${walletId}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Get a specific transaction by ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @param transferId - The transfer/transaction ID
   * @returns Transaction details
   */
  async getTransaction(coin: string, walletId: string, transferId: string) {
    try {
      this.logger.log(
        `Fetching transaction ${transferId} for wallet ${walletId} (${coin})`,
      );

      const endpoint = `/${coin}/wallet/${walletId}/transfer/${transferId}`;
      const response = await this.request(endpoint);

      return response;
    } catch (error) {
      this.logger.error(
        `Error fetching transaction ${transferId}:`,
        error.message,
      );
      throw error;
    }
  }
}
