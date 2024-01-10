import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { PageProduct } from 'src/app/common/page-product';
import { Product } from 'src/app/common/product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number=1;
  previousCategoryId: number=1;
  currentCategoryName: string = '';
  searchMode: boolean=false;


  // New properties for pagination
  thePageNumber: number=1;
  thePageSize: number=5;
  theTotalElements: number = 0;
  
  // For Search Pagination
  previousKeyword:string = "";

  constructor(private productService: ProductService, private route:ActivatedRoute, private cartService: CartService,
                  private authService:AuthService){
    
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProduct();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log("keyword="+theKeyword+",thePageNumber="+this.thePageNumber);

    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword)
                          .subscribe(this.processResult());
  }

  handleListProduct(){
    // check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if( hasCategoryId ){
      // get the "id" param string, convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    }
    else {
      // not category id available ... default to category 1
      this.currentCategoryId = 3;
      this.currentCategoryName = "Books";
    }

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log("currentCategoryId="+this.currentCategoryId+",thePageNumber="+this.thePageNumber+",size="+this.thePageSize)

    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // );

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(
      // data => {
      //   this.products = data._embedded.products;
      //   this.thePageNumber = data.page.number+1;
      //   this.thePageSize = data.page.size;
      //   this.theTotalElements = data.page.totalElements;
      // }
      this.processResult()
    );
  }

  updatePageSize(changePageSize: string){
    this.thePageSize= +changePageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  // processResult(){
  //   return (data:any)=>{
  //     this.products = data._embedded.products;
  //     this.thePageNumber = data.page.number+1;
  //     this.thePageSize = data.page.size;
  //     this.theTotalElements = data.page.totalElements;
  //   }
  // }

  processResult(){
    return (data:PageProduct)=>{
      this.products = data.content;
      this.thePageNumber = data.pageable.pageNumber+1;
      this.thePageSize = data.pageable.pageSize;
      this.theTotalElements = data.totalElements;
    }
  }

  addToCart(product:Product){
    console.log("Adding to cart:"+product.name+", "+product.unitPrice);

    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
