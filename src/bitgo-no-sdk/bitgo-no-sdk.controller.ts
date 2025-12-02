import { Controller, Get, Param, Query } from '@nestjs/common';
import { BitgoNoSdkService } from './bitgo-no-sdk.service';

@Controller('bitgo-no-sdk')
export class BitgoNoSdkController {
  constructor(private readonly bitgoNoSdkService: BitgoNoSdkService) {}

  /**
   * GET /bitgo-no-sdk/wallets?enterprise=xxx
   * Get all wallets across all coins
   * @param enterprise - Optional enterprise ID to filter wallets
   */
  @Get('wallets')
  async getWallets(@Query('enterprise') enterprise?: string) {
    return this.bitgoNoSdkService.getWallets(enterprise);
  }

  /**
   * GET /bitgo-no-sdk/wallet/:coin/:walletId
   * Get a specific wallet by ID
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   */
  @Get('wallet/:coin/:walletId')
  async getWallet(
    @Param('coin') coin: string,
    @Param('walletId') walletId: string,
  ) {
    return this.bitgoNoSdkService.getWallet(coin, walletId);
  }

  /**
   * GET /bitgo-no-sdk/wallet-tokens/:coin/:walletId
   * Get wallet tokens with balance information
   * @param coin - The cryptocurrency coin
   * @param walletId - The wallet ID
   */
  @Get('wallet-tokens/:walletId')
  async getWalletTokens(@Param('walletId') walletId: string) {
    return this.bitgoNoSdkService.getWalletTokens(walletId);
  }

  /**
   * GET /bitgo-no-sdk/transactions/:coin/:walletId?limit=25&prevId=xyz
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
    return this.bitgoNoSdkService.getTransactions(
      coin,
      walletId,
      limitNum,
      prevId,
    );
  }

  /**
   * GET /bitgo-no-sdk/transaction/:coin/:walletId/:transferId
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
    return this.bitgoNoSdkService.getTransaction(coin, walletId, transferId);
  }

  /**
   * GET /bitgo-no-sdk/enterprise/:enterpriseId/transactions
   * Get transactions for an enterprise with filtering and pagination
   * @param enterpriseId - The enterprise ID
   * @param coin - Filter by coin(s), can be repeated
   * @param state - Filter by state(s), can be repeated
   * @param type - Filter by type (send/receive)
   * @param address - Filter by address(es), can be repeated
   * @param dateGte - Start date (ISO 8601)
   * @param dateLt - End date (ISO 8601)
   * @param limit - Max results (1-500, default 500)
   * @param prevId - Pagination token
   * @param id - Filter by transaction ID
   * @param txid - Filter by blockchain tx hash
   */
  @Get('enterprise/:enterpriseId/transactions')
  async getEnterpriseTransactions(
    @Param('enterpriseId') enterpriseId: string,
    @Query('coin') coin?: string | string[],
    @Query('state') state?: string | string[],
    @Query('type') type?: string,
    @Query('address') address?: string | string[],
    @Query('dateGte') dateGte?: string,
    @Query('dateLt') dateLt?: string,
    @Query('limit') limit?: string,
    @Query('prevId') prevId?: string,
    @Query('id') id?: string,
    @Query('txid') txid?: string,
  ) {
    const options = {
      coin: Array.isArray(coin) ? coin : coin ? [coin] : undefined,
      state: Array.isArray(state) ? state : state ? [state] : undefined,
      type,
      address: Array.isArray(address)
        ? address
        : address
          ? [address]
          : undefined,
      dateGte,
      dateLt,
      limit: limit ? parseInt(limit, 10) : undefined,
      prevId,
      id,
      txid,
    };

    return this.bitgoNoSdkService.getEnterpriseTransactions(
      enterpriseId,
      options,
    );
  }
}
