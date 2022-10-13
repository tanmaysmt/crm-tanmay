import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
const routes: Routes = [
  {path: 'message',component :ModulesComponent},
  {path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)},
  {path: 'shopping', loadChildren: () => import('./shopping/shopping.module').then(m => m.ShoppingModule)},
  {path: '', loadChildren: () => import('./front/front.module').then(m => m.FrontModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }