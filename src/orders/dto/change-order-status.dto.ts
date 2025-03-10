import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "@prisma/client";



export class ChangeOrderStatusDto{

    @IsUUID(4)
    id:string;

    @IsOptional()
    @IsEnum(OrderStatusList,{
        message: `valid status are ${OrderStatusList}`
    })
    status: OrderStatus;
}