import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto,ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
 
 private readonly logger = new Logger('OrdersService');


 async onModuleInit() {
   await this.$connect();
   this.logger.log('DataBase connected')
  }
  create(createOrderDto: CreateOrderDto) {
    return  this.order.create({
      data:createOrderDto
    });
  }

  async findAll(OrderPaginationDto:OrderPaginationDto) {
      const totalPages= await this.order.count({
        where:{status:OrderPaginationDto.status}
      });
      const  currentpages = Number(OrderPaginationDto.page ??1) ;
      const perPages = Number(OrderPaginationDto.limit ?? 10);

       return{
        data: await this.order.findMany({
          skip:(currentpages-1) * perPages,
          take:perPages,
          where:{
            status:OrderPaginationDto.status
          }
        }),
        meta:{
          total: totalPages,
          page: currentpages,
          lastPage: Math.ceil(totalPages/perPages)
        }
             } ;
  }

  async findOne(id: string) {
    const order= await this.order.findFirst({
      where:{id:id}
    });
    if(!order){
      throw new RpcException({
        status:HttpStatus.NOT_FOUND,
        message:`Order whit id ${id}  not found`
      })
    }
    return order;
  }
 async changeStatus(changeOrderStatusDto:ChangeOrderStatusDto){
  
    const{id,status} =changeOrderStatusDto
    const order = await this.findOne(id);
    if(order.status==status){
      return order;
    }

    return this.order.update(
      {
        where:{id:id},
        data:{status: status}
      });    
 }

}
