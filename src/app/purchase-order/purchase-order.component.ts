import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VendorService } from '../vendor.service';
import { ProductService } from '../product.service';
import { PurchaseOrderService } from '../purchase-order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  purchaseOrderForm: FormGroup | any;
  vendors: any[] = [];
  products: any[] = [];
  taxRates = [5, 12, 18];

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.vendorService.getVendors().subscribe((data: any[]) => (this.vendors = data));
    this.productService.getProducts().subscribe((data) => (this.products = data));
    this.initializeForm();
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      localStorage.setItem('products', JSON.stringify(data));
    });
    
  }

  initializeForm() {
    this.purchaseOrderForm = this.fb.group({
      vendor: ['', Validators.required],
      email: [''],
      phone: [''],
      lineItems: this.fb.array([]),
    });
  }

  get lineItems() {
    return (this.purchaseOrderForm.get('lineItems') as FormArray);
  }

  addLineItem() {
    this.lineItems.push(
      this.fb.group({
        product: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        tax: [5, Validators.required],
      })
    );
  }

  removeLineItem(index: number) {
    this.lineItems.removeAt(index);
  }

  calculateLineTotal(lineItem: any) {
    const product = this.products.find(p => p.id === lineItem.product);
    const lineTotal = (product.price * lineItem.quantity) + ((lineItem.tax / 100) * (product.price * lineItem.quantity));
    return lineTotal;
  }

  getTotalBeforeTax() {
    return this.lineItems.controls.reduce((total, lineItem) => {
      const product = this.products.find(p => p.id === lineItem.value.product);
      return total + (product.price * lineItem.value.quantity);
    }, 0);
  }

  getTotalTax() {
    return this.lineItems.controls.reduce((total, lineItem) => {
      const product = this.products.find(p => p.id === lineItem.value.product);
      return total + ((lineItem.value.tax / 100) * (product.price * lineItem.value.quantity));
    }, 0);
  }

  getGrandTotal() {
    return this.getTotalBeforeTax() + this.getTotalTax();
  }




  onSubmit() {
    if (this.purchaseOrderForm.valid) {
      const poData = this.purchaseOrderForm.value;
  
      const poNumber = this.purchaseOrderService.addPurchaseOrder(poData);
      if (poNumber) {
        this.snackBar.open('Purchase Order submitted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
  
        setTimeout(() => {
          this.router.navigate([`/purchase-detail/${poNumber}`]);
        }, 1000);
      }
    }
  }
  

 
  
}
