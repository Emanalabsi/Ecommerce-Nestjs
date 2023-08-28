import { HttpStatus, HttpException } from '@nestjs/common';

export class PaymentFailed extends HttpException {
  constructor() {
    super(
      'An error occurred while processing payment.',
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}
