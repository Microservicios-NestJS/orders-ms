import { IsNumber, IsPositive } from "class-validator";

export class OrderItemDto{
    
    @IsNumber()
    @IsPositive()
    productID:number;
       
    @IsNumber()
    @IsPositive()
    quantity: number;
    
    @IsNumber()
    @IsPositive()
    price:number;
}