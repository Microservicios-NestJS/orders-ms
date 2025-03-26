import { IsString, IsUrl, IsUUID } from "class-validator";

export class PaidOrderDto{
    @IsString()
    stripePaymentsId:string;
    @IsString()
    @IsUUID()
    orderId:string;
    @IsUrl()
    @IsString()
    recaiptUrl:string;
}