export type TransactionName = {
  first: string,
  last: string,
}

export enum TransactionType {
  income = 'income',
  outcome = 'outcome',
  loan = 'loan',
  investment = 'investment',
}

export type Transaction = {
  _id: string,
  amount: string,
  type: TransactionType,
  name: TransactionName,
  company: string,
  email: string,
  phone: string,
  address: string,
}

export type TransactionsResponse = {
  data: Transaction[],
  total: number,
}

export type TransactionsTable = [string, number][];

export type TransactionGroups = Map<TransactionType, Transaction[]>;

export class TransactionList {
  public all: Transaction[] = [];
  public groups: TransactionGroups = new Map();

  /**
   * if not response then create with default values
   * @param response
   */
  constructor(response?: TransactionsResponse) {
    if (!response) {
      return;
    }

    this.all = response.data;

    Object.values(TransactionType).forEach((type) => {
      this.groups.set(type, this.filterByType(type));
    });
  }

  /**
   * { first, last } -> 'first last'
   * @param name
   */
  public static formatName(name: TransactionName) {
    return `${name.first} ${name.last}`;
  }

  /**
   * filter all transactions by current type
   * @param type
   * @private
   */
  private filterByType(type: TransactionType): Transaction[] {
    return this.all.filter((transaction) => transaction.type === type);
  }
}
