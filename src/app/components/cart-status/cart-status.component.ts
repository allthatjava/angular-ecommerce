import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit{

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){
  }
  ngOnInit(): void {
    this.updateCartSStates();
  }

  updateCartSStates() {
    this.cartService.totalPrice.subscribe(
      data => {
        console.log("totalPrice data:"+data);
        this.totalPrice = data
      }
    )

    this.cartService.totoalQuantity.subscribe(
      data => {
        console.log("totalQuantity data:"+data);
        this.totalQuantity = data
      }
    )
  }

}
