export class Quotation {
    constructor(
    public _id?: string,
    public BookQty: number = 0,
    public BookTitle: string = "",
    public BookAut: string = "",
    public BookPub: string = "",
    public BookDesc: string = "",
    public BookLang: string = "",
    public BookPrice: string = "",
    public BookImg: string = "",
    public QuotStatus: string = "",
    public QuotDate: string = "",
    public QuotID: string = ""
    ) {}
}