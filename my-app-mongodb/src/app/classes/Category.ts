export class Category {
    constructor(
    public _id?: any, // Không bắt buộc khi tạo
    public BookCateID: string = "",
    public BookCateName: string="",
    public BookCateDesc: string = "",
    ) {}
}

// Thêm interface riêng để tạo mới mà không cần `_id`
export interface createCategory {
    BookCateID: string; 
    BookCateName: string;
    BookCateDesc: string;
}
