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
   * Get all wallets for a specific coin
   * @param coin - The cryptocurrency coin (e.g., 'tbtc4', 'hteth', 'btc')
   * @returns List of wallets with their details
   */
  async getWallets(coin: string) {
    try {
      this.logger.log(`Fetching wallets for coin: ${coin}`);

      const wallets = await this.bitgo.coin(coin).wallets().list();

      this.logger.log(`Found ${wallets.wallets.length} wallets for ${coin}`);

      return {
        coin,
        count: wallets.wallets.length,
        wallets: wallets.wallets.map((wallet) => ({
          id: wallet.id(),
          label: wallet.label(),
          coin: wallet.coin(),
          balance: wallet.balance(),
          confirmedBalance: wallet.confirmedBalance(),
          spendableBalance: wallet.spendableBalance(),
          balanceString: wallet.balanceString(),
          confirmedBalanceString: wallet.confirmedBalanceString(),
          spendableBalanceString: wallet.spendableBalanceString(),
        })),
      };
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

      return {
        id: wallet.id(),
        label: wallet.label(),
        coin: wallet.coin(),
        balance: wallet.balance(),
        confirmedBalance: wallet.confirmedBalance(),
        spendableBalance: wallet.spendableBalance(),
        balanceString: wallet.balanceString(),
        confirmedBalanceString: wallet.confirmedBalanceString(),
        spendableBalanceString: wallet.spendableBalanceString(),
      };
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
        coins.map((coin) => this.getWallets(coin)),
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

      return {
        summary: balances,
        totalWallets: balances.reduce((sum, b) => sum + b.count, 0),
      };
    } catch (error) {
      this.logger.error('Error fetching wallet balances:', error.message);
      throw error;
    }
  }
}
