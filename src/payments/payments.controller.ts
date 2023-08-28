import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payments.service';
import { Order } from './types/order';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Res() response: Response, @Body() order: Order) {
    const paymentIntent = await this.paymentService.createPayment(order);

    return response.json({ message: 'Payment is fulfilled', paymentIntent });
  }
}
