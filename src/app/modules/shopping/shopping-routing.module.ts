import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { CategoriesComponent } from './categories/categories.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { BrandsComponent } from './brands/brands.component';
import { EditbrandComponent } from './editbrand/editbrand.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { ProductsComponent } from './products/products.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  /* product Category */
  {path :"dashboard" ,canActivate:[AuthGuard],component :DashboardComponent },
  {path :"category" ,canActivate:[AuthGuard],component :CategoriesComponent },
  {path :"category/:id" ,canActivate:[AuthGuard],component :EditcategoryComponent },
  {path :"category/add" ,canActivate:[AuthGuard],component :EditcategoryComponent },
  /* product Category

  /* Product */
  {path :"product" ,canActivate:[AuthGuard],component :ProductsComponent },
  {path :"product/:id" ,canActivate:[AuthGuard],component :EditproductComponent },
  {path :"product/add" ,canActivate:[AuthGuard],component :EditproductComponent },
  /* Product */
  
  /* Brand */
  {path :"brands" ,canActivate:[AuthGuard],component :BrandsComponent },
  {path :"brands/:id" ,canActivate:[AuthGuard],component :EditbrandComponent },
  {path :"brands/add" ,canActivate:[AuthGuard],component :EditbrandComponent },
  /* Brand */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
