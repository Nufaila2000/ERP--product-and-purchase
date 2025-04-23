import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../purchase-order.service';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css']
})
export class PurchaseDetailComponent implements OnInit {
  purchaseOrder: any;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  // ngOnInit(): void {
  //   const poNumber = this.route.snapshot.paramMap.get('poNumber');
  //   const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
  //   this.purchaseOrder = purchaseOrders.find((po: { poNumber: string | null; }) => po.poNumber === poNumber);
  // }

  ngOnInit(): void {
    const poNumber = this.route.snapshot.paramMap.get('poNumber');
    const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    this.purchaseOrder = purchaseOrders.find((po: { poNumber: string | null }) => po.poNumber === poNumber);
  
    if (this.purchaseOrder && this.purchaseOrder.lineItems) {
      this.purchaseOrder.lineItems = this.purchaseOrder.lineItems.map((item: any) => {
        const productId = typeof item.product === 'object' ? item.product.id : item.product;
        const product = this.purchaseOrderService.getProductById(productId);
        return {
          ...item,
          productName: product?.title || 'Unknown Product'
        };
      });
    }      
  }
  

  approve() {
    this.purchaseOrder.status = 'Approved';
    this.updatePurchaseOrder();
  }

  reject() {
    this.purchaseOrder.status = 'Rejected';
    this.updatePurchaseOrder();
  }

  private updatePurchaseOrder() {
    let purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    const index = purchaseOrders.findIndex((po: { poNumber: any; }) => po.poNumber === this.purchaseOrder.poNumber);
    if (index > -1) {
      purchaseOrders[index] = this.purchaseOrder;
      localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
    }
  }

  submit() {
    const submittedOrder = {
      poNumber: this.purchaseOrder?.poNumber,
      vendor: this.purchaseOrder?.vendor,
      date: this.purchaseOrder?.date,
      totalValue: this.purchaseOrder?.lineItems?.reduce((acc: number, item: any) => acc + item.total, 0),
      status: this.purchaseOrder?.status
    };

    this.purchaseOrderService.savePurchaseOrder(submittedOrder);
    this.router.navigate(['/purchase-list']);
  }
}
