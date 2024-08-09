import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  CreateTransactionDto,
  CreateTransactionResponse,
  TTransaction,
} from './dto';
import { GetUser, TUser } from 'src/user/decorator';
import { PermissionStrategy } from 'src/token/strategy';
import { JwtGuard } from 'src/token/guard';

@Controller('transaction')
@ApiBearerAuth()
@ApiTags('Transaction')
@UsePipes(ZodValidationPipe)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // create transaction
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: CreateTransactionResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['create-transaction']))
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @GetUser() user: TUser,
  ): Promise<TTransaction> {
    {
      return await this.transactionService.createTransaction(data, user);
    }
  }
}
