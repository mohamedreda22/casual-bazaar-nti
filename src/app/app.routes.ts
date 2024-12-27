import { Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { HomeContentComponent } from './home-content/home-content.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeContentComponent,
  },
  {
    path: 'home',
    component: HomeContentComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
];
