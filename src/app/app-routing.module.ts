import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/product-catalog', pathMatch: 'full' }, // Default route to Product Catalog
  { path: 'product-catalog', component: ProductCatalogComponent },
  { path: 'purchase-order', component: PurchaseOrderComponent },
  { path: 'purchase-list', component: PurchaseListComponent },
  { path: 'purchase-detail/:poNumber', component: PurchaseDetailComponent }, // Route with dynamic parameter (poNumber)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
