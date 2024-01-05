import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totoalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() { 
    // Read data from Storage
    let data = JSON.parse(this.storage.getItem("cartItems"));

    if( data != null ){
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }

  }

  addToCart(theCartItem: CartItem){

    let alreadyExistsInCart = false;
    let existingCartItem = undefined;

    if( this.cartItems.length > 0){
      // for(let tmpCartItem of this.cartItems){
      //   if( tmpCartItem.id == theCartItem.id){
      //     existingCartItem = tmpCartItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find( tmpCartItem => tmpCartItem.id == theCartItem.id);

      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  persistCartItems(){
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  decreaseQuantityFromCart(cartItem: any) {

    cartItem.quantity--;

    if( cartItem.quantity == 0 ){
      this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(cartItem:CartItem){
    var index = this.cartItems.findIndex( theCartItem => theCartItem.id == cartItem.id);
    if( index > -1){
      this.cartItems.splice(index, 1);

      this.computeCartTotals();
    }
  }

  computeCartTotals(){
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for( let tmpCartItem of this.cartItems){
      totalPriceValue += tmpCartItem.quantity * tmpCartItem.unitPrice;
      totalQuantityValue += tmpCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totoalQuantity.next(totalQuantityValue);

    // Persist cart data
    this.persistCartItems();
  }
}
