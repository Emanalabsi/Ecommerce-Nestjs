import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentFailed } from 'src/common/errors/payment-failed.error';
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

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: order.currency,
      });

      if (
        !paymentIntent ||
        paymentIntent.status !== 'requires_payment_method'
      ) {
        throw new PaymentFailed();
      }

      return paymentIntent;
    } catch (error) {
      throw new PaymentFailed();
    }
  }
}
