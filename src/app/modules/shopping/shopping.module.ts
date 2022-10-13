import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatTableModule} from '@angular/material/table'
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule} from '@angular/material/core';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { ProductsComponent } from './products/products.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AsideComponent } from './aside/aside.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { EditbrandComponent } from './editbrand/editbrand.component';
import { FooterComponent } from './footer/footer.component';
import { NoDataComponent } from './no-data/no-data.component';
import { LoaderComponent } from './loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsComponent,
    BrandsComponent,
    CategoriesComponent,
    DashboardComponent,
    AsideComponent,
    NavbarComponent,
    EditcategoryComponent,
    EditproductComponent,
    EditbrandComponent,
    FooterComponent,
    NoDataComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    ShoppingRoutingModule,FormsModule,ReactiveFormsModule,
    MatTableModule,MatPaginatorModule,CKEditorModule,
    MatSortModule,MatDatepickerModule,MatFormFieldModule,MatNativeDateModule,MatProgressSpinnerModule,NgMultiSelectDropDownModule
  ]
})
export class ShoppingModule { }
