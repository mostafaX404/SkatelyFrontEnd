import { Injectable, inject } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeAddressElement, StripeAddressElementOptions, StripePaymentElement, ConfirmationToken } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  baseUrl = 'https://localhost:5001/api/';
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
private paymentElement?: StripePaymentElement

  constructor() {
    this.stripePromise = loadStripe(environment.StripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({
          clientSecret: cart.clientSecret!,
          appearance: { labels: 'floating' }
        });
      } else {
        throw new Error('Stripe has not been loaded');
      }
    }
    return this.elements;
  }

  async createAddressElement() {
    if (!this.addressElement) {
      const elements = await this.initializeElements();
      if (elements) {

        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};

        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }

        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode
          }
        }

        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues
        };
        this.addressElement = elements.create('address', options);
      } else {
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.addressElement;
  }

 
async createConfirmationToken() {
  const stripe = await this.getStripeInstance();
  const elements = await this.initializeElements();
  
  const result = await elements.submit();
  if (result.error) throw new Error(result.error.message);

  if (stripe) {
    return await stripe.createConfirmationToken({ elements });
  } else {
    throw new Error('Stripe not available');
  }
}

async confirmPayment(confirmationToken: ConfirmationToken) {
  const stripe = await this.getStripeInstance();
  const elements = await this.initializeElements();
  const result = await elements.submit();

  if (result.error) throw new Error(result.error.message);

  const clientSecret = this.cartService.cart()?.clientSecret;
  console.log(`stripeService/confirmPayment => clientSecret = ${clientSecret}`)
  console.log(`stripeService/confirmPayment => confirmationToken = ${confirmationToken}`)

  if (stripe && clientSecret) {
   
    return await stripe.confirmPayment({
      clientSecret: clientSecret,
      confirmParams: {
        confirmation_token: confirmationToken.id
      },
      redirect: 'if_required'
    });
  } else {
    throw new Error('Unable to load stripe');
  }
}


  createOrUpdatePaymentIntent() {
   console.trace('createOrUpdatePaymentIntent called');
    const cart = this.cartService.cart();
  

    if (!cart ) throw new Error('Problem with cart');

    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(cart => {
        this.cartService.cart.set(cart);
        return cart;
      })
    );
  }

async createPaymentElement() {
    if (!this.paymentElement) {
      const elements = await this.initializeElements();
      if (elements) {
        this.paymentElement = elements.create('payment');
      } else {
        throw new Error('Elements instance has not been initialized');
      }
    }
    return this.paymentElement;
  }


  despose(){
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;

  }
}