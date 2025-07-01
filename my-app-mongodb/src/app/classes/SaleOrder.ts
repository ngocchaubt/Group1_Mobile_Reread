export class SaleOrder {
    constructor(
        public _id?: any,
        public UserID: string = "",
        public DiscountID: string = "",
        public OrderTotal:  number= 0,
        public OrderDate: string = "",
        public DeliveryMethod: string = "",
        public OrderStatus: string = "",
        public PaymentStatus: string = "",
        public Books: {
            BookISBN_n: string;
            BookQuantity: number;
        }[] = [],
        public username: string= "",
        public address: string= "",
    ){}
}

export interface createSaleOrder {
    UserID: string;
    DiscountID: string;
    OrderTotal: number;  
    OrderDate: string;
    DeliveryMethod: string;
    OrderStatus: string;
    PaymentStatus: string;
    Books: { 
        BookISBN_n: string;
        BookQuantity: number;
    }[];
    username: string;
    address: string;
}