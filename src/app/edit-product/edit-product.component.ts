import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../Services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  public productForm: FormGroup;

  public constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService, formBuilder: FormBuilder) {
    this.productForm = formBuilder.group({
      "id": formBuilder.control(0),
      "name": formBuilder.control('', Validators.required),
      "description": formBuilder.control(''),
      "price": formBuilder.control(0),
    })
  }

  public ngOnInit(): void {
    // this.currentProductId = this.route.snapshot.params['productId'];

    this.route.params.pipe(
      map((allParameters: Params) => Number.parseInt(allParameters['productId'])),
      filter((productId: number | undefined) => !!productId),
      switchMap(productId => this.productService.getProduct(productId as number))
    ).subscribe((product: Product) => {
      this.productForm.setValue(product);
    });
  }

  public onSubmit(): void {
    const product: Product = this.productForm.value;

    this.productService.updateProduct(product.id, product).subscribe((savedProduct: Product) => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/product', savedProduct.id]));
    });
  }
}
