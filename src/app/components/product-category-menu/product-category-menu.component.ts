import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit{

  productCategories: ProductCategory[]=[];

  constructor(private productService: ProductService, private authService:AuthService){

  }

  ngOnInit(){
    this.listProductCategories();
  }

  listProductCategories(){

    console.log("Waiting for Token...");
    this.authService.accessToken.subscribe((token) => console.log("Token:"+token));

    this.productService.getProductCategories().subscribe(
    (data) => {
      console.log("product Categories="+JSON.stringify(data));
      this.productCategories = data;}
    )
  }
  
}
