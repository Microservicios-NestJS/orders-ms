
import { IsEnum, IsOptional } from 'class-validator';
import { paginationDto } from 'src/common';
import {  OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from '@prisma/client';

export class OrderPaginationDto extends paginationDto {
    
    @IsOptional()   
    @IsEnum(OrderStatusList,{
            message: `valid status are ${OrderStatusList}`
        })
        status : OrderStatus;
}
