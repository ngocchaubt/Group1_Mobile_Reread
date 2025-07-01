export class Membership {
    constructor(
    public _id?: any, 
    public MbsType : string = "",
    public MinimumPaid: number = 0,
    ) {}
}

// Thêm interface riêng để tạo mới mà không cần `_id`
export interface CreateMembership {
    MbsType : string;
    MinimumPaid: number;
}
