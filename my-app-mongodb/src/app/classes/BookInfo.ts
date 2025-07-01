export class BookInfo {
    constructor(
    public _id?: any, // Không bắt buộc khi tạo
    public BookInfoID: number=0,
    public BookTitle: string="",
    public BookAut: string = "",
    public BookPub: string = "",
    public BookDesc: string = "",
    public BookGenre: string = "",
    public BookLang: string = "",
    public BookCateID: string = "",
    ) {}
}

// Thêm interface riêng để tạo mới mà không cần `_id`
export interface createBookInfo {
    BookInfoID: number;
    BookTitle: string;
    BookAut: string;
    BookPub: string;
    BookDesc: string;
    BookGenre: string;
    BookLang: string;
    BookCateID: string;
  }
  
