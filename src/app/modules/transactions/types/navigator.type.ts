import {routePaths} from '../transactions.routes';

export type NavigatorQueryParams = {
  tab: number,
};

export class NavigatorLink {
  public routerLink = [routePaths.navigator];
  public queryParams: NavigatorQueryParams;

  constructor(tabIndex: number, public text: string) {
    this.queryParams = {
      tab: tabIndex
    };
  }
}
