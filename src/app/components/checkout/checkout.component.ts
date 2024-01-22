import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup: FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;
  expirationMonths:number[] = [];
  expirationYears:number[] = [];

  countries:Country[]=[];
  shippingAddressStates:State[] = [];
  billingAddressStates:State[] = [];

  constructor(private formBuilder: FormBuilder, private shopFormService:ShopFormService,
              private cartService:CartService, private checkoutService:CheckoutService,
              private router: Router){}

  storage:Storage = sessionStorage;

  ngOnInit(){

    console.log("Checkout ngOnInit()");

    const theEmail = JSON.parse(this.storage.getItem("userEmail"));

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:new FormControl('',
                            [Validators.required, 
                              Validators.minLength(2), 
                              ShopValidators.notOnlyWhitespace]),
        lastName:new FormControl('',
                            [Validators.required, 
                              Validators.minLength(2),
                              ShopValidators.notOnlyWhitespace]),
        email:new FormControl(theEmail,[Validators.required, 
                                    Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                [Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',
        [Validators.required, 
          Validators.minLength(2), 
          ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',
            [Validators.required, 
              Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
        [Validators.required, 
          Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

 
    let startMonth = new Date().getMonth();

    this.shopFormService.getExpirationMonth(startMonth).subscribe(
      data => this.expirationMonths = data
    );

    this.shopFormService.getExpirationYear().subscribe(
      data => this.expirationYears = data
    );

    //Populate the countries
    this.shopFormService.getCountries().subscribe(
      data => this.countries = data
    )
  }

  handleMonthsAndYears(event){
    let startMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedYear = event.target.value;
    // let selectedYear = Number(this.checkoutFormGroup.get("creditCard").value.expirationYear)

    if(currentYear != selectedYear ){
      startMonth = 1;          
      this.expirationMonths = [];
    }

    this.shopFormService.getExpirationMonth(startMonth).subscribe(
      data => this.expirationMonths = data
    );
  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipcode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipcode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

      this.billingAddressStates = this.shippingAddressStates;
    }else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // setup order
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    //get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer=this.checkoutFormGroup.controls['customer'].value;

    // popluate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billinggState = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billinggState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purcahse - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert("Your order has been received> \n Order tracking number: "+response.orderTrackingNumber);

          // reset the cart
          this.resetCart();
        },
        error: err => {
          alert("There was an error: "+err.message);
        }
      }
    )

    console.log(this.checkoutFormGroup.get("customer").value);
    
    console.log("The email address is "+this.checkoutFormGroup.get("customer").value.email);
    
    console.log("The shipping address country is "+this.checkoutFormGroup.get("shippingAddress").value.country.name);
    console.log("The shipping address state is "+this.checkoutFormGroup.get("shippingAddress").value.state.name);
    
    console.log("The billing address country is "+this.checkoutFormGroup.get("billingAddress").value.country.name);
    console.log("The billing address state is "+this.checkoutFormGroup.get("billingAddress").value.state.name);
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totoalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(formGroupName+" country code:"+countryCode);
    console.log(formGroupName+" country Name:"+countryName);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if( formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        //select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  reviewCartDetails() {
    // subscribe to cartSErvice.totalQuantity
    this.cartService.totoalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    // subscribe to cartService.totalPrice;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
  }
}



