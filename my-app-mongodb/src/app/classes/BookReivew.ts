export class BookReview {
    constructor(
        public _id?: string, 
        public BookInfoID: number = 0,  
        public Reviews: { 
            UserID: string; 
            Rating: number; 
            Comment: string; 
        }[] = []  
    ) {}
}

