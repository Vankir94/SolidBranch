import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { routePaths as transactionsRoutePaths } from './modules/transactions/transactions.routes';
import {HttpClientModule} from '@angular/common/http';

const routes: Route[] = [
  {
    path: '',
    redirectTo: transactionsRoutePaths.summary,
    pathMatch: 'full',
  },
];

const commonModules = [
  BrowserModule,
  HttpClientModule,
  RouterModule.forRoot(routes),
];

const featureModules = [
  TransactionsModule,
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...commonModules,
    ...featureModules,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
