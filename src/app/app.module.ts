import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NewArrivalsComponent } from './new-arrivals/new-arrivals.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { ShopComponent } from './shop/shop.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReturnsPolicyComponent } from './returns-policy/returns-policy.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './dashboard/users/users.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
],
  declarations: [
    AppComponent,
    ShopComponent,
    BestSellersComponent,
    NewArrivalsComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    PrivacyPolicyComponent,
    ReturnsPolicyComponent,
    HomeContentComponent,
    ContactUsComponent,
    FaqsComponent,
    ShippingInfoComponent,
    TermsOfServiceComponent,
    CartComponent,
    DashboardComponent,
    UserComponent,
    ProductsComponent,
    CategoriesComponent,
    OrdersComponent
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
