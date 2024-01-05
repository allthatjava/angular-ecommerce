import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { PageProduct } from '../common/page-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api";

  constructor(private httpClient: HttpClient) { }

  // getProductListPaginate(thePage:number, thePageSize:number, theCategoryId: number): Observable<GetResponseProducts>{

  //   // need to build URL based on category id, page and size
  //   const searchUrl = this.baseUrl+"/products/search/findByCategoryId?id="+theCategoryId
  //                     +"&page="+thePage+"&size="+thePageSize;

  //   return this.httpClient.get<GetResponseProducts>(searchUrl);
  // }

  getProductListPaginate(thePage:number, thePageSize:number, theCategoryId: number): Observable<PageProduct>{

    // need to build URL based on category id, page and size
    const searchUrl = "http://localhost:8080/control/products?id="+theCategoryId
                      +"&page="+thePage+"&size="+thePageSize;

    return this.httpClient.get<PageProduct>(searchUrl);
  }

  getProductList(currentCategoryId:number): Observable<Product[]>{

    // need to build URL based on category id
    const searchUrl = this.baseUrl+"/products/search/findByCategoryId?id="+currentCategoryId;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{
    const url = this.baseUrl+"/product-category";
  
    return this.httpClient.get<GetResponseProductCategory>(url).pipe(
      map( response => response._embedded.productCategory)
    );
  }

  searchProducts(keyword:string): Observable<Product[]>{
        // need to build URL based on category id
    const searchUrl = this.baseUrl+"/products/search/findByNameContaining?name="+keyword;
    return this.getProducts(searchUrl);
  }
  
  // searchProductsPaginate(thePage:number, thePageSize:number, keyword: string): Observable<GetResponseProducts>{

  //   // need to build URL based on category name, page and size
  //   const searchUrl = this.baseUrl+"/products/search/findByNameContaining?name="+keyword
  //                     +"&page="+thePage+"&size="+thePageSize;

  //   return this.httpClient.get<GetResponseProducts>(searchUrl);
  // }

  searchProductsPaginate(thePage:number, thePageSize:number, keyword: string): Observable<PageProduct>{

    // need to build URL based on category name, page and size
    // const searchUrl = "http://localhost:8080/api/products/search/findByNameContaining?name="+keyword
    //                   +"&page="+thePage+"&size="+thePageSize;
    const searchUrl = "http://localhost:8080/control/products/search?name="+keyword
                      +"&page="+thePage+"&size="+thePageSize;

    return this.httpClient.get<PageProduct>(searchUrl);
  }

  public getProducts(searchUrl:string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map( response => response._embedded.products)
    )
  }

  public getProduct(theProductId: number): Observable<Product>{
    const productUrl = this.baseUrl+"/products/"+theProductId;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
  page:{
    size:number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
