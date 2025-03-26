import { OrderStatus } from "@prisma/client";

export interface OrderWhithProduts{
   
        OrderItem: {
            name: any;
            productId: number;
            quantity: number;
            price: number;
        }[];
        id: string;
        totalAmount: number;
        totaItems: number;
        status: OrderStatus;
        paid: boolean;
        paiAt: Date | null;
        createdAt: Date;
        updateAt: Date;
    
}