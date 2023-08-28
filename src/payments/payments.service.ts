import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentFailed } from 'src/utils/errors/payment-failed.error';
import { Stripe } from 'stripe';
import { Order } from './types/order';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private stripe: Stripe,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-08-16',
    });
  }
  async createPayment(order: Order) {
    let totalAmount = 0;
    order.products.forEach((product) => {
      totalAmount += product.price * product.quantity;
    });

    const paymentIntent = this.stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: order.currency,
    });
    if (!paymentIntent) {
      throw new PaymentFailed();
    }
    return paymentIntent;
  }
}
