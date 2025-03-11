import { OrderStatus } from "@prisma/client";
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { Type } from "class-transformer";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

    
    
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=> OrderItemDto)
    items: OrderItemDto[];
    
    

    
    /* 
    @IsNumber()
    @IsPositive()
    totalAmount:number;

    @IsNumber()
    @IsPositive()
    
    totaItems:number;
    
    @IsEnum(OrderStatusList,{
        message: `Possible status value are ${OrderStatusList}`
    })
    @IsOptional()
    status : OrderStatus= OrderStatus.PENDIENTE;
   
    @IsBoolean()
    @IsOptional()
    paid: boolean = false;
  */
}
