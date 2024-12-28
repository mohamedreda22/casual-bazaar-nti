import { Routes } from '@angular/router';
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
  }
];
