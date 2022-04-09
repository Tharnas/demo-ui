import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductListComponent,
    children: [
      {
        path: ':productId',
        component: EditProductComponent
      }
    ]
  },
  {
    path: '',
    component: StartComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
