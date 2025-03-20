import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from 'src/config';
import { NastModule } from 'src/nast/nast.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [NastModule  ],
})
export class OrdersModule {}
