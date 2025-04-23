// import { Component, OnInit } from '@angular/core';
// import { PurchaseOrderService } from '../purchase-order.service';

// @Component({
//   selector: 'app-purchase-list',
//   templateUrl: './purchase-list.component.html',
//   styleUrls: ['./purchase-list.component.css']
// })
// export class PurchaseListComponent implements OnInit {
//   purchaseOrders: any[] = [];

//   constructor(private purchaseOrderService: PurchaseOrderService) {}

//   ngOnInit(): void {
//     this.purchaseOrderService.getPurchaseOrders().subscribe((orders) => {
//       this.purchaseOrders = orders;
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../purchase-order.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  purchaseOrders: any[] = [];

  constructor(private poService: PurchaseOrderService) {}

  ngOnInit(): void {
  //   this.poService.getPurchaseOrders().subscribe((orders) => {
  //     this.purchaseOrders = orders;
  //   });
  // }
//   this.poService.getPurchaseOrders().subscribe((orders) => {
//     this.purchaseOrders = orders;

//     // Append submitted order if exists
// //     const newOrder = this.poService.getSubmittedOrder();
// //     if (newOrder) {
// //       this.purchaseOrders.unshift(newOrder); // Add it to the top of the list
// //     }
//   });
//  }
this.poService.getPurchaseOrders().subscribe((orders) => {
  this.purchaseOrders = orders;
});
}


exportSingleOrderToPDF(order: any): void {
  const doc = new jsPDF();

  doc.text('Purchase Order Details', 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [['Field', 'Value']],
    body: [
      ['PO Number', order.poNumber],
      ['Vendor', order.vendor],
      ['Date', order.date],
      ['Total Value', order.totalValue],
      ['Status', order.status]
    ]
  });

  doc.save(`PO-${order.poNumber}.pdf`);
}
}
