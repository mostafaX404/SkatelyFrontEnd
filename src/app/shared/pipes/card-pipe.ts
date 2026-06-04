import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken, PaymentMethod } from '@stripe/stripe-js';
import { PaymentSummary } from '../models/order';

type CardInput =
  | ConfirmationToken['payment_method_preview']
  | PaymentSummary
  | PaymentMethod['card'];

@Pipe({
  name: 'card',
})
export class CardPipe implements PipeTransform {

  transform(value?: CardInput): string {

    if (!value) return 'Unknown payment method';

    // 🔵 Stripe ConfirmationToken preview
    if ('card' in value && value.card) {
      const { brand, last4, exp_month, exp_year } = value.card;

      return `${brand.toUpperCase()} **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }

    // 🟢 App PaymentSummary model
    if ('expMonth' in value) {
      const { brand, last4, expMonth, expYear } = value as PaymentSummary;

      return `${brand.toUpperCase()} **** ${last4}, Exp: ${expMonth}/${expYear}`;
    }

    return 'Unknown payment method';
  }
}