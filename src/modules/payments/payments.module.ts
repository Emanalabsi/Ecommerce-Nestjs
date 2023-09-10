import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';
import { Stripe } from 'stripe';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY'), {
          apiVersion: '2023-08-16',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService],
})
export class PaymentsModule {}
