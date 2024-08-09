import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatorService } from 'src/common/paginator.service';
import { PrismaService } from 'src/common/prisma.service';
import { TUser } from 'src/user/decorator';
import { CreateTransactionDto, TTransaction } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async createTransaction(
    data: CreateTransactionDto,
    user: TUser,
  ): Promise<TTransaction> {
    return this.prisma.$transaction(async (prisma) => {
      // checking balance if expense are more than balance
      if (data.type === 'EXPENSE') {
        const account = await prisma.account.update({
          where: { id: data.accountId },
          data: {
            balance: {
              decrement: new Decimal(data.amount),
            },
          },
        });
        if (account.balance < new Decimal(0)) {
          throw new BadRequestException(
            `Insufficient balance in account ${account.accountName}`,
          );
        }
      } else {
        // increment balance
        await prisma.account.update({
          where: { id: data.accountId },
          data: {
            balance: {
              increment: new Decimal(data.amount),
            },
          },
        });
      }
      // create transaction
      const transaction = await this.prisma.transaction.create({
        data: {
          amount: new Decimal(data.amount),
          userId: user.id,
          categoryId: data.categoryId,
          accountId: data.accountId,
          transactionDate: new Date(data.transactionDate),
          type: data.type,
          description: data.description,
        },
        select: {
          id: true,
          userId: true,
          categoryId: true,
          accountId: true,
          amount: true,
          transactionDate: true,
          type: true,
          description: true,
        },
      });
      const amountDecimal: Decimal = transaction.amount;
      return {
        ...transaction,
        amount: amountDecimal.toNumber(),
        transactionDate: transaction.transactionDate.toISOString(),
      };
    });
  }
}
