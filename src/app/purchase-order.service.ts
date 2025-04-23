


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private purchaseOrdersSubject = new BehaviorSubject<any[]>(this.getStoredOrders());

  private purchaseOrders: any[] = [];
  private submittedOrder: any;
  private readonly STORAGE_KEY = 'purchaseOrders';

  constructor() {
    const storedOrders = localStorage.getItem('purchaseOrders');
    if (storedOrders) {
      this.purchaseOrders = JSON.parse(storedOrders);
    }
  }

  setSubmittedOrder(order: any) {
    this.submittedOrder = order;
  }

  getSubmittedOrder() {
    return this.submittedOrder;
  }

  private getStoredOrders(): any[] {
        return JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
      }

  addPurchaseOrder(po: any): string {
    const poNumber = 'PO' + new Date().getTime();
    po.poNumber = poNumber;
    po.date = new Date().toISOString().split('T')[0];
    po.status = 'Pending';

    po.lineItems = po.lineItems.map((item: any) => {
      const product = this.getProductById(item.product);
      const total = (product.price * item.quantity) + ((item.tax / 100) * product.price * item.quantity);
      return { ...item, total };
    });

    this.purchaseOrders.push(po);
    localStorage.setItem('purchaseOrders', JSON.stringify(this.purchaseOrders));
    return poNumber;
  }

  getProductById(id: string) {
  
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log(products,"product")
    return products.find((p: any) => p.id === id) || { price: 0 };
  }

 
  getPurchaseOrders(): Observable<any[]> {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return of(saved ? JSON.parse(saved) : []);
  }
  savePurchaseOrder(order: any): void {
    const current = localStorage.getItem(this.STORAGE_KEY);
    const orders = current ? JSON.parse(current) : [];
    orders.unshift(order); 
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }
}
