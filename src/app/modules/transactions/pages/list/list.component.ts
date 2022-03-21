import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigatorLink, NavigatorQueryParams} from '../../types/navigator.type';
import {TransactionsService} from '../../services/transactions.service';
import {TransactionsTable} from '../../types/transaction.type';

@Component({
  selector: 'list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ListPageComponent implements OnInit {
  public activeTabIndex = this.route.queryParams.pipe(
    map(params => Number(params['tab'])),
    tap((index) => this.onActiveIndexChange(index)),
  );
  public data = new BehaviorSubject<TransactionsTable>([]);
  public links = new BehaviorSubject<NavigatorLink[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public transactionsService: TransactionsService,
  ) {}

  public async changeTab(tabIndex: number): Promise<void> {
    const type = this.transactionsService.getTypeByIndex(tabIndex);
    await this.transactionsService.goTo(type);
  }

  public async ngOnInit() {
    const currentTabIndex = (this.route.snapshot.queryParams as NavigatorQueryParams).tab;
    const type = this.transactionsService.getTypeByIndex(currentTabIndex);

    await this.transactionsService.getTable(type);

    if (!this.checkIndexIsValid(currentTabIndex)) {
      await this.router.navigate(['./'], {
        relativeTo: this.route,
        queryParams: {
          tab: 0,
        },
      });
    }

    this.links.next(
      this.transactionsService.getTypes().map((type) => {
        return new NavigatorLink(this.transactionsService.getTypeIndex(type), type);
      }),
    );
    await this.onActiveIndexChange(currentTabIndex);
  }

  private checkIndexIsValid(index): boolean {
    const i = Number(index);
    return !isNaN(i) && i >= 0 && i < this.transactionsService.getTypes().length;
  }

  private async onActiveIndexChange(index: number): Promise<void> {
    this.data.next(
      await this.transactionsService.getTable(
        this.transactionsService.getTypeByIndex(index),
      ),
    );
  }
}
