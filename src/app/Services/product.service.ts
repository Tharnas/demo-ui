import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public getProduct(id: number): Observable<Product> {
    // Die "Anfürungszeichen" sind backticks ([Umschalt] + [rechts von ß] -> [leertaste])
    return this.httpClient.get<Product>(`/api/product/${id}`);
  }

  public getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/product');
  }

  public updateProduct(productId: number, product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`/api/product/${productId}`, product);
  }
}
