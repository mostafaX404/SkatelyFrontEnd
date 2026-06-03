import { Pipe, PipeTransform } from '@angular/core';
import { Card, PaymentMethod } from '@stripe/stripe-js';

@Pipe({
  name: 'card',
})
export class CardPipe implements PipeTransform {

  transform(value?: PaymentMethod["card"], ...args: unknown[]): unknown {
    
    if(value?.brand && value?.exp_month && value?.exp_year && value?.last4){
      return `${value.brand.toUpperCase() } **** **** **** ${value.last4},EXP: ${value.exp_month}/${value.exp_year}`
    }else{
      return `unknown card`
    }

  }

}
