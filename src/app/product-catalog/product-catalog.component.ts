import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  isEditing: boolean;
}

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data.map(product => ({ ...product, isEditing: false }));
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRandomStockLevel(): string {
    const stock = Math.floor(Math.random() * 100) + 1;
    return stock > 50 ? 'In Stock' : 'Out of Stock';
  }

  editProduct(product: Product): void {
    if (product.isEditing) {
      console.log('Saving product:', product);
    } else {
      console.log('Editing product:', product);
    }
    product.isEditing = !product.isEditing;
  }

  deleteProduct(product: Product): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${product.title}?`);
    if (confirmDelete) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.dataSource.data = this.products;
      console.log('Product deleted:', product);
    }
  }
}
