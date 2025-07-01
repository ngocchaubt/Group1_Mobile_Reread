export class Discount {
    constructor(
    public _id?: any, // Không bắt buộc khi tạo
    public DiscountID: string = "",
    public DiscRate: number = 0,
    public DiscValidFrom: string = "",
    public DiscValidTo: string = "",
    public DiscLeft: number = 0,
    public DiscUsed: number = 0,
    public DiscReq: number = 0
    ) {}
}

// Thêm interface riêng để tạo mới mà không cần `_id`
export interface CreateDiscount {
    DiscountID: string; 
    DiscRate: number;
    DiscValidFrom: string;
    DiscValidTo: string;
    DiscLeft: number;
    DiscUsed: number;
    DiscReq: number;
}
