import { Injectable } from '@nestjs/common';
import { paginator, TPaginateFunction } from '../utils/paginator';

@Injectable()
export class PaginatorService {
  paginate: TPaginateFunction = paginator({ page: 1, perPage: 10 });
}
