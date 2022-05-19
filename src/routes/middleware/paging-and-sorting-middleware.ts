import HttpException from '../../utils/exceptions/HttpException';

export type OrderByI = 'ASC' | 'DESC';

const defaultLimit = Number(process.env.DEFAULT_LIMIT) || 10;
const defaultPage = Number(process.env.DEFAULT_PAGE) || 0;
const defaultSort = process.env.DEFAULT_SORT || 'DESC';
const defaultOrderBy = process.env.DEFAULT_ORDERBY || 'createdAt';

export interface PagingAndSortingQuery {
  page: number;
  limit: number;
  sort: OrderByI;
  orderBy: string;
}

export interface PagingData {
  skip: number;
  take: number;
  currentPage: Number;
}
export interface SortingData {
  sort: OrderByI;
  orderBy: string;
}

async function pagingAndSortingMiddleware(req: Record<string, any>, res, next) {
  const {
    limit = defaultLimit,
    page = defaultPage,
    sort = defaultSort,
    orderBy = defaultOrderBy,
  } = req.query as PagingAndSortingQuery;
  const offset = Math.max((page - 1) * limit, 0);

  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    next(new HttpException(400, 'Bad request, Invalid paging parameters'));
  }

  req.pagingData = { skip: offset, take: limit, currentPage: page };
  req.sortingData = { sort, orderBy };
  next();
}

export default pagingAndSortingMiddleware;
