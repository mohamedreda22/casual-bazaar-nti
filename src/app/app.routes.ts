import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReturnsPolicyComponent } from './returns-policy/returns-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { CookiesSettingsComponent } from './cookies-settings/cookies-settings.component';
import { NewArrivalsComponent } from './new-arrivals/new-arrivals.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { NgModule } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SinglepageComponent } from './singlepage/singlepage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeContentComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  { path: 'product/:productId', component: SinglepageComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'returns-policy',
    component: ReturnsPolicyComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'shipping-info',
    component: ShippingInfoComponent,
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
  },
  {
    path: 'cookies-settings',
    component: CookiesSettingsComponent,
  },
  {
    path: 'new-arrivals',
    component: NewArrivalsComponent,
  },
  {
    path: 'best-sellers',
    component: BestSellersComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'admin-dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
