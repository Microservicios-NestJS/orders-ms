import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import{ChangeOrderStatusDto,OrderPaginationDto,CreateOrderDto} from './dto'

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({cmd: 'createOrder'})
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({cmd: 'findAllOrders'})
  findAll(@Payload()orderPaginationDto:OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern({cmd:'findOneOrder'})
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({cmd:'changeOrderStatus'})
  changeOrderStatus(@Payload()ChangeOrderStatusDto:ChangeOrderStatusDto){
    return this.ordersService.changeStatus(ChangeOrderStatusDto)
  }

}
