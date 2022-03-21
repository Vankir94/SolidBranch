import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {TransactionsService} from '../../services/transactions.service';
import {Transaction, TransactionGroups} from '../../types/transaction.type';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'summary-page',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SummaryPageComponent {
  public transactions = new BehaviorSubject<Transaction[]>([]);
  public transactionGroups = new BehaviorSubject<TransactionGroups>(new Map());

  constructor(
    public transactionsService: TransactionsService,
  ) {}

  async ngOnInit() {
    this.transactions.next(await this.transactionsService.get());
    this.transactionGroups.next(await this.transactionsService.getGroups());
  }
}
