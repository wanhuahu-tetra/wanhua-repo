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

  /**
   * GET /bitgo/wallet-tokens/:coin/:walletId
   * Get wallet tokens with smart contract information
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   */
  @Get('wallet-tokens/:coin/:walletId')
  async getWalletTokens(
    @Param('coin') coin: string,
    @Param('walletId') walletId: string,
  ) {
    return this.bitgoService.getWalletTokens(coin, walletId);
  }

  /**
   * GET /bitgo/token-info/:tokenName
   * Get token configuration information
   * @param tokenName - Token name (e.g., 'tbsc:busd', 'hteth:goud')
   */
  @Get('token-info/:tokenName')
  async getTokenInfo(@Param('tokenName') tokenName: string) {
    return this.bitgoService.getTokenInfo(tokenName);
  }

  /**
   * GET /bitgo/coin-info/:coinName
   * Get coin configuration information
   * @param coinName - Coin name (e.g., 'tbsc', 'hteth', 'tbtc4')
   */
  @Get('coin-info/:coinName')
  async getCoinInfo(@Param('coinName') coinName: string) {
    return this.bitgoService.getCoinInfo(coinName);
  }
}
