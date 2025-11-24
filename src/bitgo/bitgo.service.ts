import { Injectable, Logger } from '@nestjs/common';
import { BitGo } from 'bitgo';

@Injectable()
export class BitgoService {
  private readonly logger = new Logger(BitgoService.name);
  private bitgo: BitGo;

  constructor() {
    // Initialize BitGo
    this.bitgo = new BitGo({
      accessToken: '',
      env: 'test',
    });
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

      const url = enterprise
        ? this.bitgo.url(`/wallets?enterprise=${enterprise}`, 2)
        : this.bitgo.url('/wallets', 2);

      const response = await this.bitgo.get(url).result();

      this.logger.log(`Found ${response.wallets.length} wallets`);

      return response.wallets;
    } catch (error) {
      this.logger.error('Error fetching wallets:', error.message);
      throw error;
    }
  }

  /**
   * Get all wallets for a specific coin
   * @param coin - The cryptocurrency coin (e.g., 'tbtc4', 'hteth', 'btc')
   * @returns List of wallets with their details
   */
  async getWalletsByCoin(coin: string) {
    try {
      this.logger.log(`Fetching wallets for coin: ${coin}`);

      const wallets = await this.bitgo.coin(coin).wallets().get({
        allTokens: true,
        includeBalance: true,
        id: '6924cd32958a9f96d03e2833cb7de197',
      });

      // this.logger.log(`Found ${wallets.wallets.length} wallets for ${coin}`);

      return wallets;
    } catch (error) {
      this.logger.error(`Error fetching wallets for ${coin}:`, error.message);
      throw error;
    }
  }

  /**
   * Get a specific wallet by ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @returns Wallet details with balance
   */
  async getWallet(coin: string, walletId: string) {
    try {
      this.logger.log(`Fetching wallet ${walletId} for coin: ${coin}`);

      const wallet = await this.bitgo
        .coin(coin)
        .wallets()
        .get({ id: walletId });

      return wallet;
    } catch (error) {
      this.logger.error(`Error fetching wallet ${walletId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get wallet balances summary for multiple coins
   * @param coins - Array of coins to check (e.g., ['tbtc', 'teth'])
   * @returns Summary of balances across all coins
   */
  async getWalletBalances(coins: string[]) {
    try {
      this.logger.log(
        `Fetching wallet balances for coins: ${coins.join(', ')}`,
      );

      const results = await Promise.allSettled(
        coins.map((coin) => this.getWalletsByCoin(coin)),
      );

      const balances = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          this.logger.warn(
            `Failed to fetch wallets for ${coins[index]}: ${result.reason}`,
          );
          return {
            coin: coins[index],
            error: result.reason.message,
            count: 0,
            wallets: [],
          };
        }
      });

      return results;
    } catch (error) {
      this.logger.error('Error fetching wallet balances:', error.message);
      throw error;
    }
  }

  /**
   * Get transactions for a specific wallet
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @param limit - Maximum number of transactions to return (default: 25)
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

      const wallet = await this.bitgo
        .coin(coin)
        .wallets()
        .get({ id: walletId });

      const options: any = { limit };
      if (prevId) {
        options.prevId = prevId;
        options.allTokens = true;
        options.limit = 20;
      }

      const transfers = await wallet.transfers(options);

      this.logger.log(
        `Found ${transfers.transfers.length} transactions for wallet ${walletId}`,
      );

      return transfers;
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

      const wallet = await this.bitgo
        .coin(coin)
        .wallets()
        .get({ id: walletId });

      const transfer = await wallet.getTransfer({ id: transferId });

      return {
        id: transfer.id,
        coin: transfer.coin,
        wallet: transfer.wallet,
        txid: transfer.txid,
        height: transfer.height,
        heightId: transfer.heightId,
        date: transfer.date,
        confirmations: transfer.confirmations,
        value: transfer.value,
        valueString: transfer.valueString,
        feeString: transfer.feeString,
        payGoFeeString: transfer.payGoFeeString,
        usd: transfer.usd,
        usdRate: transfer.usdRate,
        state: transfer.state,
        tags: transfer.tags,
        history: transfer.history,
        comment: transfer.comment,
        entries: transfer.entries,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching transaction ${transferId}:`,
        error.message,
      );
      throw error;
    }
  }
}
