import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

// Components
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';

// Guards & Interceptor
import { AuthGuard, RoleGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'products',        component: ProductsComponent },
      { path: 'products/:id',    component: ProductDetailsComponent },
      { path: 'cart',            component: CartComponent,          canActivate: [AuthGuard] },
      { path: 'checkout',        component: CheckoutComponent,      canActivate: [AuthGuard] },
      { path: 'orders',            component: OrdersComponent,          canActivate: [AuthGuard] },
      { path: 'profile',           component: ProfileComponent,         canActivate: [AuthGuard] },
      { path: 'all-orders',        component: OrdersComponent,          canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
      { path: 'dashboard',         component: DashboardComponent,       canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'SELLER'] } },
      { path: 'manage-products',   component: ManageProductsComponent,  canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'SELLER'] } },
      { path: 'manage-categories', component: ManageCategoriesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
    ]
  },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    DashboardComponent,
    ManageProductsComponent,
    OrdersComponent,
    ConfirmDialogComponent,
    ManageCategoriesComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    // Material
    MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule,
    MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
    MatBadgeModule, MatTooltipModule, MatStepperModule, MatChipsModule,
    MatMenuModule, MatRadioModule, MatSlideToggleModule, MatDividerModule,
    MatExpansionModule,
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
