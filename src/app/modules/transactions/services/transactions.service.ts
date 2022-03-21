import {Injectable} from '@angular/core';
import {
  Transaction,
  TransactionGroups,
  TransactionList,
  TransactionsResponse, TransactionsTable,
  TransactionType
} from '../types/transaction.type';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, delay, firstValueFrom, tap} from 'rxjs';
import {Cache} from '../../../shared/helpers/cache.helper';
import {Router} from '@angular/router';
import {routePaths} from '../transactions.routes';
import {NavigatorQueryParams} from '../types/navigator.type';

@Injectable()
export class TransactionsService {
  private transactionsUrl = './assets/mock/transactions.json';

  /**
   * loader stream
   */
  public loader = new BehaviorSubject<boolean>(false);

  /**
   * cache value of TransactionList
   * @private
   */
  private cache = new Cache<TransactionList>(new TransactionList(), 60);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public getTypeIndex(type: TransactionType): number {
    return this.getTypes().indexOf(type);
  }

  public getTypeByIndex(typeIndex: number): TransactionType {
    return this.getTypes()[typeIndex];
  }

  /**
   * get types as array
   */
  public getTypes(): TransactionType[] {
    return [...this.cache.get().value.groups.keys()];
  }

  /**
   * navigate to tab
   * @param type
   */
  public async goTo(type: TransactionType): Promise<void> {
    const queryParams: NavigatorQueryParams = { tab: this.getTypeIndex(type) };
    await this.router.navigate([routePaths.navigator], { queryParams });
  }

  /**
   * if type then get transactions for current type else get all
   * @param type
   */
  public async get(type?: TransactionType): Promise<Transaction[]> {
    const transactionList = await this.getTransactionList();
    return type ? transactionList.groups.get(type) : transactionList.all;
  }

  /**
   * get groups of transactions by type
   */
  public async getGroups(): Promise<TransactionGroups> {
    return (await this.getTransactionList()).groups;
  }

  /**
   * get table for type with [name, amount] columns
   * @param type
   */
  public async getTable(type: TransactionType): Promise<TransactionsTable> {
    const transactions: Map<string, number> = new Map();

    for (const { name: nameObj, amount: amountStr } of await this.get(type)) {
      const name = TransactionList.formatName(nameObj);
      const amount = Number(amountStr);

      transactions.set(name, transactions.has(name) ? transactions.get(name) + amount : amount);
    }

    return [...transactions.entries()];
  }

  /**
   * if cache is expired then load else get from cache
   * @private
   */
  private async getTransactionList(): Promise<TransactionList> {
    const { isExpired, value } = this.cache.get();
    return isExpired ? await this.loadAll() : value;
  }

  /**
   * emulate loading transactions from server for random time in limit [0, 5]s
   * set transactionList as cache
   * @private
   */
  private async loadAll(): Promise<TransactionList> {
    this.loader.next(true);

    const transactionList = new TransactionList(
      await firstValueFrom(
        this.http.get<TransactionsResponse>(this.transactionsUrl).pipe(
          delay(Math.random() * 1000 * 3),
          tap(() => this.loader.next(false)),
        ),
      )
    );

    this.cache.set(transactionList);

    return transactionList;
  }
}
