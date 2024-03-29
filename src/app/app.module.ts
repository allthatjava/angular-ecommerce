import { Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { ProductService } from './services/product.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from './config/my-app-config';
import { GithubCallbackComponent } from './components/login/github-callback/github-callback.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OnlyLoggedInUsersGuard } from './guard/member-guard.guard';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

// import {
//   OktaAuthModule,
//   OktaCallbackComponent,
//   OKTA_CONFIG
// } from '@okta/okta-angular';

// import { OktaAuth } from '@okta/okta-auth-js';

// const oktaConfig=myAppConfig.oidc;

// const oktaAuth= new OktaAuth(oktaConfig);

const routes: Routes = [
  {path:"order-history", component:OrderHistoryComponent, canActivate:[OnlyLoggedInUsersGuard]},
  {path:"members", component:MembersPageComponent, canActivate:[OnlyLoggedInUsersGuard]},

  {path:"github-callback", component:GithubCallbackComponent},
  {path:"login", component:LoginComponent},

  {path:"checkout", component:CheckoutComponent},
  {path:"cart-details", component:CartDetailsComponent},
  {path:"products/:id", component:ProductDetailsComponent},
  {path:"search/:keyword", component:ProductListComponent},
  {path:"category/:id/:name", component: ProductListComponent},
  {path:"category", component: ProductListComponent},
  {path:"products", component: ProductListComponent},
  {path:"", redirectTo:"/products", pathMatch:"full"},
  {path:"**", redirectTo:"/products", pathMatch:"full"}
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    GithubCallbackComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OAuthModule.forRoot()
  ],
  providers: [
    ProductService, 
    {provide: OAuthModule, useValue: authConfig},
    OnlyLoggedInUsersGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
