export interface createBookStock {
    BookISBN_n: string;
    BookPrice: number;
    BookSales: number;
    BookImg1: string;
    BookImg2: string;
    BookCond: string;
    CurrentQty: number;
    PlacedQty: number;
    ExpectedQty: number;
    ReturnedQty: number;
    BookInfoID: number;
    BookTitle: string;
  }
  
  export class BookStock {
    constructor(
      public _id?: any, 
      public BookISBN_n: string = "",
      public BookPrice: number = 0,
      public BookSales: number = 0,
      public BookImg1: string = "",
      public BookImg2: string = "",
      public BookCond: string = "",
      public CurrentQty: number = 0,
      public PlacedQty: number = 0,
      public ExpectedQty: number = 0,
      public ReturnedQty: number = 0,
      public BookInfoID: number = 0,
      public BookTitle: string = "",
    ) {}
    }