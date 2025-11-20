import { Controller, Get, Param, Query } from '@nestjs/common';
import { BitgoService } from './bitgo.service';

@Controller('bitgo')
export class BitgoController {
  constructor(private readonly bitgoService: BitgoService) {}

  /**
   * GET /bitgo/wallets/:coin
   * Get all wallets for a specific coin
   * @param coin - The cryptocurrency coin (e.g., 'tbtc', 'teth')
   */
  @Get('wallets/:coin')
  async getWallets(@Param('coin') coin: string) {
    return this.bitgoService.getWallets(coin);
  }

  /**
   * GET /bitgo/wallet/:coin/:walletId
   * Get a specific wallet by ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   */
  @Get('wallet/:coin/:walletId')
  async getWallet(
    @Param('coin') coin: string,
    @Param('walletId') walletId: string,
  ) {
    return this.bitgoService.getWallet(coin, walletId);
  }

  /**
   * GET /bitgo/balances?coins=tbtc,teth
   * Get wallet balances for multiple coins
   * @param coins - Comma-separated list of coins
   */
  @Get('balances')
  async getBalances(@Query('coins') coins: string) {
    const coinArray = coins ? coins.split(',').map((c) => c.trim()) : ['tbtc'];
    return this.bitgoService.getWalletBalances(coinArray);
  }
}
