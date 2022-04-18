import { Component } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  // public products: Product[] = [
  //   {
  //     id: 1,
  //     name: "first",
  //     description: "this is my first product."
  //   },
  //   {
  //     id: 2,
  //     name: "second",
  //     description: "this is my second product."
  //   },
  // ];
  public products: Observable<Product[]>;

  constructor(productService: ProductService) {
    this.products = productService.getProducts()
      .pipe(catchError(() => {
        console.log('Beim Abfragen der Produkte ist ein Fehler aufgetreten.');
        return of([]);
      }));
  }
}
