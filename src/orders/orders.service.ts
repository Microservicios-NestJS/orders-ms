import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto,ChangeOrderStatusDto } from './dto';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
 
 private readonly logger = new Logger('OrdersService');
 constructor(
  @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
) {
   super();
 }

 async onModuleInit() {
   await this.$connect();
   this.logger.log('DataBase connected')
  }
  async create(createOrderDto: CreateOrderDto) {

    try {
      const ids= createOrderDto.items.map(items=> items.productID)
      const product: any[]= await firstValueFrom(this.productsClient.send({cmd: 'validate_products'},ids))
      
      
      const totalAmount= createOrderDto.items.reduce((acc, OrderItems )=>{
          const price= product.find(
            (product)=> product.id == OrderItems.productID,
          ).price;
          return acc+ (price*OrderItems.quantity);
      },0)
      const totalItems= createOrderDto.items.reduce( (acc , OrderItems )=> {
        return acc + OrderItems.quantity;
      },0)
      const order= await this.order.create({
        data:{
          totalAmount:totalAmount,
          totaItems:totalItems,
          OrderItem:{
            createMany:{
              data: createOrderDto.items.map((orderItem)=>({
                price:product.find(product=> product.id==orderItem.productID).price,
                productId:orderItem.productID,
                quantity: orderItem.quantity,              
              }))
            }
          }
        },
        include:{
          OrderItem:{
            select:{
              price: true,
              quantity:true,
              productId:true,
            }
          }
        }
      });
      return {
        ...order,
        OrderItem:order.OrderItem.map((orderItem)=>({
          ...orderItem,
          name:product.find((product)=>product.id == orderItem.productId
        ).name,
        }))
      };

    } catch (error) {
      throw new RpcException({
        status:HttpStatus.BAD_REQUEST,
        message:`check log`
      })
    }
    /*return{
    service:'Order Microservice',
    createOrderDto: createOrderDto
   }
     return  this.order.create({
      data:createOrderDto
    });
    */
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
      where:{id:id},
      include:{
        OrderItem:{
          select:
              {price: true,
                quantity:true,
                productId:true,
              }
              
        }
      }
    });
    if(!order){
      throw new RpcException({
        status:HttpStatus.NOT_FOUND,
        message:`Order whit id ${id}  not found`
      })
    }
     const ProdutsIds= order.OrderItem.map(orderItem =>orderItem.productId)
     const product: any[]= await firstValueFrom(this.productsClient.send({cmd: 'validate_products'},ProdutsIds
     ),);

     return {
      ...order,
      OrderItem:order.OrderItem.map((orderItem)=>({
        ...orderItem,
        name:product.find((product)=>product.id == orderItem.productId
      ).name,
      }))
    };
    return order;
  }
 async changeStatus(changeOrderStatusDto:ChangeOrderStatusDto){
  
    const{id,status} =changeOrderStatusDto
    const order = await this.findOne(id);
    if(order?.status==status){
      return order;
    }

    return this.order.update(
      {
        where:{id:id},
        data:{status: status}
      });    
 }

}
