import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import { ListPageComponent } from './pages/list/list.component';
import { SummaryPageComponent } from './pages/summary/summary.component';
import {routePaths} from './transactions.routes';
import {TransactionsService} from './services/transactions.service';

const routes: Route[] = [
  {
    path: routePaths.navigator,
    component: ListPageComponent,
  },
  {
    path: routePaths.summary,
    component: SummaryPageComponent,
  }
];

@NgModule({
  declarations: [
    ListPageComponent,
    SummaryPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    TransactionsService,
  ],
})
export class TransactionsModule { }
