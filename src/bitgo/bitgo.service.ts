import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentName } from 'bitgo';
import { BitGoAPI } from '@bitgo/sdk-api';
import { Hteth } from '@bitgo/sdk-coin-eth';
import { Btc, Tbtc4 } from '@bitgo/sdk-coin-btc';

@Injectable()
export class BitgoService {
  private readonly logger = new Logger(BitgoService.name);
  private bitgo: BitGoAPI;
  private accessToken: string;
  private env: EnvironmentName;

  constructor() {
    // Load environment variables
    this.accessToken = process.env.ACCESS_TOKEN || '';
    this.env = (process.env.ENV || 'test') as EnvironmentName;

    // Initialize BitGo
    this.bitgo = new BitGoAPI({
      accessToken: this.accessToken,
      env: this.env,
    });

    // Register coins
    this.bitgo.register('hteth', Hteth.createInstance);
    this.bitgo.register('tbtc4', Tbtc4.createInstance);
    this.bitgo.register('btc', Btc.createInstance);

    this.logger.log(`BitGo initialized with environment: ${this.env}`);
    this.logger.log('Registered coins: hteth, tbtc4, btc');
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
