import { Controller, Get, Param, Query } from '@nestjs/common';
import { BitgoService } from './bitgo.service';

@Controller('bitgo')
export class BitgoController {
  constructor(private readonly bitgoService: BitgoService) {}

  /**
   * GET /bitgo/wallets?enterprise=xxx
   * Get all wallets across all coins
   * @param enterprise - Optional enterprise ID to filter wallets
   */
  @Get('wallets')
  async getWallets(@Query('enterprise') enterprise?: string) {
    return this.bitgoService.getWallets(enterprise);
  }

  /**
   * GET /bitgo/wallets/:coin
   * Get all wallets for a specific coin
   * @param coin - The cryptocurrency coin (e.g., 'tbtc', 'teth')
   */
  @Get('wallets/:coin')
  async getWalletsByCoin(@Param('coin') coin: string) {
    return this.bitgoService.getWalletsByCoin(coin);
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

  /**
   * GET /bitgo/transactions/:coin/:walletId?limit=25&prevId=xyz
   * Get transactions for a specific wallet
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @param limit - Maximum number of transactions (default: 25)
   * @param prevId - Previous transaction ID for pagination
   */
  @Get('transactions/:coin/:walletId')
  async getTransactions(
    @Param('coin') coin: string,
    @Param('walletId') walletId: string,
    @Query('limit') limit?: string,
    @Query('prevId') prevId?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 25;
    return this.bitgoService.getTransactions(coin, walletId, limitNum, prevId);
  }

  /**
   * GET /bitgo/transaction/:coin/:walletId/:transferId
   * Get a specific transaction by ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   * @param transferId - The transfer/transaction ID
   */
  @Get('transaction/:coin/:walletId/:transferId')
  async getTransaction(
    @Param('coin') coin: string,
    @Param('walletId') walletId: string,
    @Param('transferId') transferId: string,
  ) {
    return this.bitgoService.getTransaction(coin, walletId, transferId);
  }
}
