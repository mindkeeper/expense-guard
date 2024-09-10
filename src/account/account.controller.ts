import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AllAccountsResponse,
  CreateAccountDto,
  CreateAccountResponse,
  TAccountQuery,
  TAllAccounts,
  TCreateAccountResponse,
  TUpdateAccountResponse,
  UpdateAccountDto,
} from './dto';
import { GetUser, TUser } from '../user/decorator';
import { JwtGuard } from '../token/guard';
import { PermissionStrategy } from '../token/strategy';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller('account')
@ApiTags('Account')
@UsePipes(ZodValidationPipe)
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: CreateAccountResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['create-account']))
  async createAccount(
    @Body() data: CreateAccountDto,
    @GetUser() user: TUser,
  ): Promise<TCreateAccountResponse> {
    return await this.accountService.createAccount(data, user);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: CreateAccountResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['update-account']))
  async updateAccount(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateAccountDto,
    @GetUser() user: TUser,
  ): Promise<TUpdateAccountResponse> {
    return await this.accountService.updateAccount(id, data, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get account List',
    type: AllAccountsResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'accountName', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] })
  @UseGuards(JwtGuard, new PermissionStrategy(['get-accounts']))
  async findAll(
    @GetUser() user: TUser,
    @Query('accountName') accountName: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('perPage', new ParseIntPipe({ optional: true })) perPage: number,
    @Query('sortField', new DefaultValuePipe('id')) sortField: string,
    @Query('sortDirection', new DefaultValuePipe('asc'))
    sortDirection: 'asc' | 'desc',
  ): Promise<TAllAccounts> {
    const query: TAccountQuery = {
      accountName,
      page,
      perPage,
      sortField,
      sortDirection,
    };

    return await this.accountService.findAll(query, user);
  }
}
