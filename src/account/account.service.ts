import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  CreateAccountDto,
  TAccountQuery,
  TAllAccounts,
  TCreateAccountResponse,
  TUpdateAccountResponse,
  UpdateAccountDto,
} from './dto';
import { TUser } from '../user/decorator';
import { Decimal } from '@prisma/client/runtime/library';
import { PaginatorService } from '../common/paginator.service';

type TAccount = {
  id: number;
  accountName: string;
  balance: Decimal;
};

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async createAccount(
    data: CreateAccountDto,
    user: TUser,
  ): Promise<TCreateAccountResponse> {
    const {
      accountName,
      balance: balanceValue,
      id,
      userId,
    } = await this.prisma.account.create({
      data: { accountName: data.accountName, balance: 0, userId: user.id },
      select: {
        id: true,
        accountName: true,
        balance: true,
        userId: true,
      },
    });
    const balance: Decimal = balanceValue;
    return {
      id,
      userId,
      accountName,
      balance: balance.toNumber(),
    };
  }

  async updateAccount(
    id: number,
    data: UpdateAccountDto,
    user: TUser,
  ): Promise<TUpdateAccountResponse> {
    const account = await this.prisma.account.findFirst({
      where: { id, userId: user.id },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const { accountName, balance: balanceValue } =
      await this.prisma.account.update({
        where: { id },
        data: { accountName: data.accountName },
        select: {
          id: true,
          userId: true,
          accountName: true,
          balance: true,
        },
      });

    const balance: Decimal = balanceValue;
    return {
      id,
      userId: user.id,
      accountName,
      balance: balance.toNumber(),
    };
  }

  async findAll(query: TAccountQuery, user: TUser): Promise<TAllAccounts> {
    const conditions = [];
    if (query.accountName) {
      conditions.push({
        accountName: {
          contains: query.accountName,
          mode: 'insensitive',
        },
      });
    }
    conditions.push({ userId: user.id });
    const { items, meta } = await this.paginator.paginate(
      this.prisma.account,
      {
        where: {
          AND: conditions,
        },
        select: {
          id: true,
          accountName: true,
          balance: true,
        },
        orderBy: {
          [query.sortField]: query.sortDirection,
        },
      },
      { page: query.page, perPage: query.perPage },
    );

    const accounts = items.map((account: TAccount) => {
      return {
        id: account.id,
        accountName: account.accountName,
        balance: account.balance.toNumber(),
      };
    });
    return { items: accounts, meta };
  }
}
