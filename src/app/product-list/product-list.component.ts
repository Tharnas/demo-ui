import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // public products: Product[] | null = [
  //   { name: "first", description: "this is my first product." }
  // ];
  public products: Observable<Product[]>;

  constructor(productService: ProductService) {
    // const newProduct = new Product();
    // newProduct.name = "second";
    // newProduct.description = "this is my second product";
    // this.products?.push(newProduct);

    // this.products?.push({ name: "third", description: "this is my third product" });

    this.products = productService.getProducts()
      .pipe(catchError(() => {
        console.log('Beim Abfragen der Produkte ist ein Fehler aufgetreten.');
        return of([]);
      }));
  }

  ngOnInit(): void {
  }
}
